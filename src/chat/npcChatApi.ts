import type {
  HealthResponse,
  NpcChatJobResponse,
  NpcChatMode,
  NpcChatMessageRequest,
  NpcChatSessionRequest,
  NpcChatSessionResponse,
} from '../shared/npcChat'

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string }
    return body.error || `Erro HTTP ${response.status}.`
  } catch {
    return `Erro HTTP ${response.status}.`
  }
}

async function postJson<TResponse, TRequest>(url: string, body: TRequest) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as TResponse
}

export async function fetchHealth() {
  const response = await fetch('/api/health')

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as HealthResponse
}

export function ensureNpcSession(body: NpcChatSessionRequest) {
  return postJson<NpcChatSessionResponse, NpcChatSessionRequest>('/api/npc-chat/session', body)
}

export function sendNpcChatMessage(body: NpcChatMessageRequest) {
  return postJson<NpcChatJobResponse, NpcChatMessageRequest>('/api/npc-chat/message', body)
}

export type { NpcChatMode }

export async function fetchNpcChatJob(jobId: string) {
  const response = await fetch(`/api/npc-chat/message-status?jobId=${encodeURIComponent(jobId)}`)

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as NpcChatJobResponse
}
