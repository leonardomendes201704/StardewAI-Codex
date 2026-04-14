export interface InteractionAnchor {
  id: string
  title: string
  tileX: number
  tileY: number
  prompt: string
  radius: number
  dialogLines: string[]
}

export function createInitialInteractionAnchors(): InteractionAnchor[] {
  return [
    {
      id: 'house-mailbox',
      title: 'Caixa de correio',
      tileX: 18,
      tileY: 11,
      prompt: 'Ler correio',
      radius: 22,
      dialogLines: [
        'A caixa de correio da casinha esta vazia por enquanto.',
        'Ela sera uma das interacoes reais do vertical slice.',
      ],
    },
    {
      id: 'farm-sign',
      title: 'Placa da fazenda',
      tileX: 13,
      tileY: 12,
      prompt: 'Ler placa',
      radius: 22,
      dialogLines: [
        'Fazenda Codex: caminhe, explore e teste cada ponto de interacao.',
        'O objetivo deste slice e provar o loop base do jogo com custo baixo de runtime.',
      ],
    },
    {
      id: 'farm-plot',
      title: 'Canteiro',
      tileX: 29,
      tileY: 15,
      prompt: 'Examinar canteiro',
      radius: 24,
      dialogLines: [
        'As mudas ainda estao simples, mas este canteiro ja responde a interacao.',
        'Ele vai alternar o estado visual para mostrar progressao do mundo.',
      ],
    },
    {
      id: 'village-npc',
      title: 'Vizinho',
      tileX: 36,
      tileY: 12,
      prompt: 'Conversar',
      radius: 22,
      dialogLines: [
        'Se voce chegou ate aqui, o slice ja tem mapa, movimento, colisao e interacao.',
        'A proxima fase pode adicionar interior da casa, plantio real e mais NPCs.',
      ],
    },
  ]
}
