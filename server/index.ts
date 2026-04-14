import http from 'node:http'
import {
  getNpcDefinition,
  type HealthResponse,
  type NpcChatMessageRequest,
  type NpcChatMessageResponse,
  type NpcChatSessionRequest,
  type NpcChatSessionResponse,
} from '../src/shared/npcChat.js'
import { checkCodexAvailable, generateNpcReply } from './lib/codexCli.js'
import { createMessage, createSession, ensureSessionDir, getExistingSession, saveSession, touchSession } from './lib/sessionStore.js'

const HOST = '127.0.0.1'
const PORT = 8787

const activeSessions = new Set<string>()

function sendJson(response: http.ServerResponse, statusCode: number, body: unknown) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

function sendError(response: http.ServerResponse, statusCode: number, message: string) {
  sendJson(response, statusCode, { error: message })
}

async function readJsonBody<T>(request: http.IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    throw new Error('Corpo JSON ausente.')
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T
}

async function handleHealth(response: http.ServerResponse) {
  const body: HealthResponse = {
    ok: true,
    codexAvailable: await checkCodexAvailable(),
    workdir: process.cwd(),
  }

  sendJson(response, 200, body)
}

async function handleSession(request: http.IncomingMessage, response: http.ServerResponse) {
  const body = await readJsonBody<NpcChatSessionRequest>(request)
  const npc = getNpcDefinition(body.npcId)

  if (!npc) {
    sendError(response, 404, 'NPC desconhecido para sessao de chat.')
    return
  }

  const existing = await getExistingSession(body.sessionId)
  const session = existing && existing.npcId === npc.id ? existing : createSession(npc)

  await saveSession(session)

  const payload: NpcChatSessionResponse = {
    sessionId: session.sessionId,
    npcId: session.npcId,
    npcName: session.npcName,
    messages: session.messages,
  }

  sendJson(response, 200, payload)
}

async function handleMessage(request: http.IncomingMessage, response: http.ServerResponse) {
  const body = await readJsonBody<NpcChatMessageRequest>(request)

  if (!body.sessionId || !body.message.trim()) {
    sendError(response, 400, 'Sessao e mensagem sao obrigatorias.')
    return
  }

  const session = await getExistingSession(body.sessionId)

  if (!session) {
    sendError(response, 404, 'Sessao de chat nao encontrada.')
    return
  }

  const npc = getNpcDefinition(session.npcId)

  if (!npc) {
    sendError(response, 404, 'NPC associado a sessao nao foi encontrado.')
    return
  }

  if (activeSessions.has(session.sessionId)) {
    sendError(response, 409, 'Ja existe uma resposta em andamento para este NPC.')
    return
  }

  activeSessions.add(session.sessionId)

  try {
    const userMessage = createMessage('user', body.message.trim())
    const nextSession = touchSession({
      ...session,
      messages: [...session.messages, userMessage],
    })

    const replyText = await generateNpcReply(npc, nextSession, userMessage.content)
    const reply = createMessage('assistant', replyText)
    const finalSession = touchSession({
      ...nextSession,
      messages: [...nextSession.messages, reply],
    })

    await saveSession(finalSession)

    const payload: NpcChatMessageResponse = {
      sessionId: finalSession.sessionId,
      reply,
      messages: finalSession.messages,
    }

    sendJson(response, 200, payload)
  } finally {
    activeSessions.delete(session.sessionId)
  }
}

await ensureSessionDir()

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

  if (!request.url || !request.method) {
    sendError(response, 400, 'Requisicao invalida.')
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  try {
    const url = new URL(request.url, `http://${HOST}:${PORT}`)

    if (request.method === 'GET' && url.pathname === '/api/health') {
      await handleHealth(response)
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/npc-chat/session') {
      await handleSession(request, response)
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/npc-chat/message') {
      await handleMessage(request, response)
      return
    }

    sendError(response, 404, 'Endpoint nao encontrado.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado no backend do NPC.'
    sendError(response, 500, message)
  }
})

server.listen(PORT, HOST, () => {
  console.log(`StardewAI NPC backend ativo em http://${HOST}:${PORT}`)
})
