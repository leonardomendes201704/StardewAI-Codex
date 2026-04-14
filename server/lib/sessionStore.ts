import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { NpcChatMessage, NpcChatSession, NpcDefinition } from '../../src/shared/npcChat.js'

function resolveDataDir() {
  if (process.env.STARDEWAI_NPC_DATA_DIR) {
    return process.env.STARDEWAI_NPC_DATA_DIR
  }

  const localAppData = process.env.LOCALAPPDATA

  if (localAppData) {
    return path.join(localAppData, 'StardewAI-Codex', 'npc-chat')
  }

  return path.join(os.homedir(), '.stardewai-codex', 'npc-chat')
}

export const NPC_CHAT_DATA_DIR = resolveDataDir()

function getSessionPath(sessionId: string) {
  return path.join(NPC_CHAT_DATA_DIR, `${sessionId}.json`)
}

export async function ensureSessionDir() {
  await mkdir(NPC_CHAT_DATA_DIR, { recursive: true })
}

export async function loadSession(sessionId: string) {
  const raw = await readFile(getSessionPath(sessionId), 'utf8')
  return JSON.parse(raw) as NpcChatSession
}

export async function saveSession(session: NpcChatSession) {
  await ensureSessionDir()
  await writeFile(getSessionPath(session.sessionId), JSON.stringify(session, null, 2), 'utf8')
}

export async function getExistingSession(sessionId?: string | null) {
  if (!sessionId) {
    return null
  }

  try {
    return await loadSession(sessionId)
  } catch {
    return null
  }
}

export function createMessage(role: NpcChatMessage['role'], content: string): NpcChatMessage {
  return {
    id: randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  }
}

export function createSession(npc: NpcDefinition) {
  const now = new Date().toISOString()
  const greeting = createMessage('assistant', npc.greeting)

  return {
    sessionId: randomUUID(),
    npcId: npc.id,
    npcName: npc.name,
    createdAt: now,
    updatedAt: now,
    messages: [greeting],
  } satisfies NpcChatSession
}

export function touchSession(session: NpcChatSession) {
  return {
    ...session,
    updatedAt: new Date().toISOString(),
  }
}
