export interface NpcChatOpenDetail {
  npcId: string
}

export interface NpcChatStateDetail {
  isOpen: boolean
  npcId: string | null
}

const NPC_CHAT_OPEN_EVENT = 'stardewai:npc-chat-open'
const NPC_CHAT_STATE_EVENT = 'stardewai:npc-chat-state'

const npcChatBridge = new EventTarget()

export function requestNpcChatOpen(detail: NpcChatOpenDetail) {
  npcChatBridge.dispatchEvent(new CustomEvent(NPC_CHAT_OPEN_EVENT, { detail }))
}

export function emitNpcChatState(detail: NpcChatStateDetail) {
  npcChatBridge.dispatchEvent(new CustomEvent(NPC_CHAT_STATE_EVENT, { detail }))
}

export function onNpcChatOpen(listener: (detail: NpcChatOpenDetail) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<NpcChatOpenDetail>).detail)
  }

  npcChatBridge.addEventListener(NPC_CHAT_OPEN_EVENT, handler)

  return () => npcChatBridge.removeEventListener(NPC_CHAT_OPEN_EVENT, handler)
}

export function onNpcChatState(listener: (detail: NpcChatStateDetail) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<NpcChatStateDetail>).detail)
  }

  npcChatBridge.addEventListener(NPC_CHAT_STATE_EVENT, handler)

  return () => npcChatBridge.removeEventListener(NPC_CHAT_STATE_EVENT, handler)
}
