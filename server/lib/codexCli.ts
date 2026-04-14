import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { NpcChatSession, NpcDefinition } from '../../src/shared/npcChat.js'

const MAX_HISTORY_MESSAGES = 24
const CODEX_TIMEOUT_MS = 90_000

interface CodexInvocation {
  command: string
  prefixArgs: string[]
}

function resolveCodexInvocation(): CodexInvocation {
  if (process.env.STARDEWAI_CODEX_CLI) {
    return {
      command: process.env.STARDEWAI_CODEX_CLI,
      prefixArgs: [],
    }
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA

    if (appData) {
      const cliScript = path.join(appData, 'npm', 'node_modules', '@openai', 'codex', 'bin', 'codex.js')

      if (existsSync(cliScript)) {
        return {
          command: process.execPath,
          prefixArgs: [cliScript],
        }
      }
    }
  }

  return {
    command: 'codex',
    prefixArgs: [],
  }
}

export async function checkCodexAvailable() {
  const invocation = resolveCodexInvocation()

  return new Promise<boolean>((resolve) => {
    const child = spawn(invocation.command, [...invocation.prefixArgs, '--version'], {
      cwd: process.cwd(),
      stdio: 'ignore',
      windowsHide: true,
    })

    const timeout = setTimeout(() => {
      child.kill()
      resolve(false)
    }, 5_000)

    child.once('error', () => {
      clearTimeout(timeout)
      resolve(false)
    })

    child.once('exit', (code) => {
      clearTimeout(timeout)
      resolve(code === 0)
    })
  })
}

function buildConversationPrompt(npc: NpcDefinition, session: NpcChatSession, message: string) {
  const history = session.messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => `${entry.role === 'user' ? 'Jogador' : npc.name}: ${entry.content}`)
    .join('\n')

  return [
    `Voce e ${npc.name}, um NPC de um jogo local 2D inspirado em Stardew Valley.`,
    'Fale sempre em portugues do Brasil.',
    'Responda como personagem que vive dentro do jogo, sem se apresentar como assistente generico.',
    'Voce pode ler os arquivos do repositorio local quando precisar confirmar detalhes do codigo ou do mundo.',
    'Nao invente funcionalidades nao implementadas. Quando algo ainda nao existir, diga isso claramente.',
    'Se o jogador perguntar sobre a implementacao, explique com base nos arquivos locais, mas mantenha um tom diegetico e amigavel.',
    'Prefira respostas curtas: de 2 a 5 frases, salvo quando o jogador pedir detalhes tecnicos.',
    '',
    `Seu nome: ${npc.name}`,
    `Onde voce vive: ${npc.locationSummary}`,
    'Fatos do mundo atual:',
    ...npc.worldFacts.map((fact) => `- ${fact}`),
    'Regras de comportamento:',
    ...npc.personaRules.map((rule) => `- ${rule}`),
    'Arquivos preferenciais para consulta:',
    ...npc.preferredFiles.map((filePath) => `- ${filePath}`),
    '',
    'Historico recente da conversa:',
    history || '(sem historico anterior alem da saudacao inicial)',
    '',
    `Nova mensagem do jogador: ${message}`,
    '',
    `Responda apenas com a fala final do NPC ${npc.name}, sem markdown, sem cabecalhos e sem prefixos de papel.`,
  ].join('\n')
}

export async function generateNpcReply(npc: NpcDefinition, session: NpcChatSession, message: string) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'stardewai-codex-'))
  const outputFile = path.join(tempDir, 'last-message.txt')
  const prompt = buildConversationPrompt(npc, session, message)
  const invocation = resolveCodexInvocation()

  const args = [
    ...invocation.prefixArgs,
    'exec',
    '--ephemeral',
    '-C',
    process.cwd(),
    '-s',
    'read-only',
    '-o',
    outputFile,
    prompt,
  ]

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(invocation.command, args, {
        cwd: process.cwd(),
        windowsHide: true,
        stdio: ['ignore', 'ignore', 'pipe'],
      })

      let stderr = ''

      const timeout = setTimeout(() => {
        child.kill()
        reject(new Error('O Codex CLI excedeu o tempo limite do chat.'))
      }, CODEX_TIMEOUT_MS)

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString()
      })

      child.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })

      child.once('exit', (code) => {
        clearTimeout(timeout)

        if (code === 0) {
          resolve()
          return
        }

        reject(new Error(stderr.trim() || `O Codex CLI encerrou com codigo ${code}.`))
      })
    })

    const content = (await readFile(outputFile, 'utf8')).trim()

    if (!content) {
      throw new Error('O Codex CLI nao retornou texto para o NPC.')
    }

    return content
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}
