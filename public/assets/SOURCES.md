# Sources

## Assets selecionados

### Puny World Tileset

- Origem: https://opengameart.org/content/16x16-puny-world-tileset
- Arquivo bruto: `public/assets/raw/tiles/punyworld-overworld-tileset.png`
- Licenca: CC0
- Papel no projeto: base do cenario externo de fazenda/vila

### Puny Characters

- Origem: https://opengameart.org/content/puny-characters
- Arquivos brutos:
  - `public/assets/raw/characters/puny-character-base.png`
  - `public/assets/raw/characters/puny-soldier-blue.png`
- Licenca: CC0
- Papel no projeto: personagem principal e candidato inicial para NPC

## Curadoria

- O runtime final deve preferir arquivos curados em vez de usar o material bruto completo.
- Qualquer fallback ou substituicao precisa ser registrado aqui.

## Arquivos curados para runtime

- `public/assets/world/farm-slice.png`
  - corte do tileset original sem a faixa preta final
- `public/assets/characters/player-walk.png`
  - 3 direcoes (`down`, `left`, `up`) com 3 frames cada
- `public/assets/characters/player-idle.png`
  - 3 direcoes (`down`, `left`, `up`) com 1 frame cada
- `public/assets/characters/npc-walk.png`
  - mesma curadoria compacta para NPC
- `public/assets/characters/npc-idle.png`
  - idle compacto para NPC

## Observacao de runtime

- Movimento para a direita reutiliza a animacao da esquerda com espelhamento horizontal para reduzir atlas e memoria.
