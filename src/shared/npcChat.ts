export type NpcChatRole = 'user' | 'assistant'

export interface NpcChatMessage {
  id: string
  role: NpcChatRole
  content: string
  createdAt: string
}

export interface NpcChatSession {
  sessionId: string
  npcId: string
  npcName: string
  createdAt: string
  updatedAt: string
  messages: NpcChatMessage[]
}

export interface NpcDefinition {
  id: string
  name: string
  greeting: string
  locationSummary: string
  worldFacts: string[]
  personaRules: string[]
  preferredFiles: string[]
}

export interface NpcChatSessionRequest {
  npcId: string
  sessionId?: string | null
}

export interface NpcChatSessionResponse {
  sessionId: string
  npcId: string
  npcName: string
  messages: NpcChatMessage[]
}

export interface NpcChatMessageRequest {
  sessionId: string
  message: string
}

export interface NpcChatMessageResponse {
  sessionId: string
  reply: NpcChatMessage
  messages: NpcChatMessage[]
}

export interface HealthResponse {
  ok: boolean
  codexAvailable: boolean
  workdir: string
}

export const NPC_SESSION_STORAGE_PREFIX = 'stardewai:npc-session:'

export const NPC_DEFINITIONS: Record<string, NpcDefinition> = {
  'village-npc': {
    id: 'village-npc',
    name: 'Vizinho',
    greeting:
      'Ola. Eu moro aqui perto da parte leste da fazenda. Se quiser, posso conversar sobre o mundo e tambem sobre o codigo deste jogo.',
    locationSummary: 'Parte leste do mapa, perto do caminho, do canteiro cercado e da casa do jogador.',
    worldFacts: [
      'Este mundo e um vertical slice local inspirado em Stardew Valley.',
      'Existe uma casinha do personagem no centro-superior do mapa, com caixa de correio na frente.',
      'O lago fica a oeste da casa e o canteiro cercado fica a leste do caminho principal.',
      'O jogador anda com WASD ou setas e usa E para interagir.',
      'O jogo roda em Phaser 3.90 com renderer Canvas, pensando em PCs fracos.',
    ],
    personaRules: [
      'Fale em portugues do Brasil.',
      'Responda como um NPC que vive dentro do jogo.',
      'Se o jogador perguntar sobre codigo, voce pode explicar com base no repositorio local.',
      'Nao invente features que ainda nao existem.',
      'Se algo nao estiver implementado, diga isso de forma direta.',
      'Prefira respostas curtas, entre 2 e 5 frases, salvo quando pedirem detalhe tecnico.',
    ],
    preferredFiles: [
      'README.md',
      'docs/architecture.md',
      'src/game/data/worldData.ts',
      'src/game/data/interactionData.ts',
      'src/game/scenes/FarmScene.ts',
    ],
  },
}

export function getNpcDefinition(npcId: string) {
  return NPC_DEFINITIONS[npcId]
}
