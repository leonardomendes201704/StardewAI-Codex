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
  ]
}
