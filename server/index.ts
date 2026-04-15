import http from 'node:http'
import { randomUUID } from 'node:crypto'
import {
  getNpcDefinition,
  type HealthResponse,
  type NpcChatJobEvent,
  type NpcChatJobResponse,
  type NpcChatJobStatus,
  type NpcChatMode,
  type NpcChatMessageRequest,
  type NpcChatSessionRequest,
  type NpcChatSessionResponse,
} from '../src/shared/npcChat.js'
import { checkCodexAvailable, generateNpcReply } from './lib/codexCli.js'
import { createMessage, createSession, ensureSessionDir, getExistingSession, saveSession, touchSession } from './lib/sessionStore.js'

const HOST = '127.0.0.1'
const PORT = 8787

const HEARTBEAT_INTERVAL_MS = 1_000
const JOB_RETENTION_MS = 10 * 60_000

const activeSessions = new Map<string, string>()
const jobs = new Map<string, NpcChatJobResponse>()

function resolveChatMode(mode?: NpcChatMode): NpcChatMode {
  return mode === 'builder' ? 'builder' : 'read-only'
}

function createJob(sessionId: string, npcId: string, mode: NpcChatMode): NpcChatJobResponse {
  const now = new Date().toISOString()

  return {
    jobId: randomUUID(),
    sessionId,
    npcId,
    mode,
    status: 'queued',
    phase: 'Pedido recebido',
    detail:
      mode === 'builder'
        ? 'Vizinho vai preparar o ambiente para mexer no jogo.'
        : 'Vizinho vai preparar a leitura do seu pedido.',
    startedAt: now,
    updatedAt: now,
    heartbeatAt: now,
    events: [],
  }
}

function appendJobEvent(job: NpcChatJobResponse, message: string): NpcChatJobEvent[] {
  return [
    ...job.events.slice(-4),
    {
      id: randomUUID(),
      message,
      createdAt: new Date().toISOString(),
    },
  ]
}

function upsertJob(jobId: string, updater: (job: NpcChatJobResponse) => NpcChatJobResponse) {
  const job = jobs.get(jobId)

  if (!job) {
    return
  }

  jobs.set(jobId, updater(job))
}

function setJobPhase(jobId: string, phase: string, detail: string, eventMessage = phase) {
  upsertJob(jobId, (job) => {
    const now = new Date().toISOString()

    return {
      ...job,
      status: job.status === 'queued' ? 'running' : job.status,
      phase,
      detail,
      updatedAt: now,
      heartbeatAt: now,
      events: appendJobEvent(job, eventMessage),
    }
  })
}

function setJobHeartbeat(jobId: string) {
  upsertJob(jobId, (job) => ({
    ...job,
    heartbeatAt: new Date().toISOString(),
  }))
}

function finalizeJob(
  jobId: string,
  status: Extract<NpcChatJobStatus, 'succeeded' | 'failed'>,
  patch: Partial<NpcChatJobResponse>,
  eventMessage: string,
) {
  upsertJob(jobId, (job) => {
    const now = new Date().toISOString()

    return {
      ...job,
      ...patch,
      status,
      updatedAt: now,
      heartbeatAt: now,
      events: appendJobEvent(job, eventMessage),
    }
  })

  setTimeout(() => {
    jobs.delete(jobId)
  }, JOB_RETENTION_MS).unref?.()
}

async function processChatJob(
  jobId: string,
  npcId: string,
  sessionId: string,
  message: string,
  mode: NpcChatMode,
) {
  const session = await getExistingSession(sessionId)

  if (!session) {
    finalizeJob(jobId, 'failed', {
      phase: 'Sessao perdida',
      detail: 'A sessao do NPC nao foi encontrada antes do processamento.',
      error: 'Sessao de chat nao encontrada.',
    }, 'Falha ao localizar a sessao')
    activeSessions.delete(sessionId)
    return
  }

  const npc = getNpcDefinition(npcId)

  if (!npc) {
    finalizeJob(jobId, 'failed', {
      phase: 'NPC ausente',
      detail: 'O NPC associado a sessao nao esta mais disponivel.',
      error: 'NPC associado a sessao nao foi encontrado.',
    }, 'Falha ao localizar o NPC')
    activeSessions.delete(sessionId)
    return
  }

  const heartbeat = setInterval(() => {
    setJobHeartbeat(jobId)
  }, HEARTBEAT_INTERVAL_MS)

  try {
    setJobPhase(
      jobId,
      mode === 'builder' ? 'Preparando trabalho' : 'Preparando leitura',
      mode === 'builder'
        ? 'Vizinho esta organizando o pedido antes de mexer no jogo.'
        : 'Vizinho esta organizando o pedido antes de responder.',
    )

    const userMessage = createMessage('user', message)
    const nextSession = touchSession({
      ...session,
      messages: [...session.messages, userMessage],
    })

    const replyText = await generateNpcReply(npc, nextSession, userMessage.content, mode, (progress) => {
      setJobPhase(jobId, progress.phase, progress.detail)
    })

    setJobPhase(jobId, 'Persistindo resultado', 'Vizinho esta salvando o estado final da conversa.')

    const reply = createMessage('assistant', replyText)
    const finalSession = touchSession({
      ...nextSession,
      messages: [...nextSession.messages, reply],
    })

    await saveSession(finalSession)

    finalizeJob(jobId, 'succeeded', {
      phase: 'Concluido',
      detail: 'Vizinho terminou o pedido e salvou o resultado.',
      reply,
      messages: finalSession.messages,
    }, 'Pedido concluido')
  } catch (error) {
    const failure = error instanceof Error ? error.message : 'Erro inesperado durante o trabalho do NPC.'

    finalizeJob(jobId, 'failed', {
      phase: 'Falha no processamento',
      detail: 'Vizinho nao conseguiu concluir o pedido desta vez.',
      error: failure,
    }, 'Falha durante o processamento')
  } finally {
    clearInterval(heartbeat)
    activeSessions.delete(sessionId)
  }
}

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
  const mode = resolveChatMode(body.mode)

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

  const job = createJob(session.sessionId, session.npcId, mode)
  jobs.set(job.jobId, job)
  activeSessions.set(session.sessionId, job.jobId)
  sendJson(response, 202, job)
  void processChatJob(job.jobId, session.npcId, session.sessionId, body.message.trim(), mode)
}

function handleMessageStatus(url: URL, response: http.ServerResponse) {
  const jobId = url.searchParams.get('jobId')

  if (!jobId) {
    sendError(response, 400, 'jobId e obrigatorio.')
    return
  }

  const job = jobs.get(jobId)

  if (!job) {
    sendError(response, 404, 'Job de chat nao encontrado.')
    return
  }

  sendJson(response, 200, job)
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

    if (request.method === 'GET' && url.pathname === '/api/npc-chat/message-status') {
      handleMessageStatus(url, response)
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
