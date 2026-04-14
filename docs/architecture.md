# Arquitetura minima

## Runtime

- `src/main.ts` monta a shell HTML e sobe o `Phaser.Game`.
- `src/game/config.ts` concentra renderer, resolucao, scale e fisica.
- `src/game/scenes/FarmScene.ts` orquestra preload, mapa, player, camera, colisao e interacoes.

## Dados

- `src/game/data/worldData.ts` gera as camadas do mundo, metadados da casa e estados do canteiro.
- `src/game/data/interactionData.ts` define os alvos interativos do slice.

## UI

- `src/game/ui/DialogUi.ts` desenha a caixa de dialogo reutilizavel fixa na camera.

## Assets

- `public/assets/world/` contem o tileset curado do mundo.
- `public/assets/characters/` contem as folhas compactas de player e NPC.
- `public/assets/raw/` guarda os arquivos de origem para rastreabilidade.

## Fluxo de jogo

1. A cena carrega o tileset e monta o mapa por dados.
2. O player nasce em frente a casa e pode andar pelo mundo.
3. A camera segue o player e a colisao bloqueia areas invalidas.
4. O sistema de proximidade escolhe a interacao ativa.
5. `E` abre dialogo ou altera estado do mundo.
