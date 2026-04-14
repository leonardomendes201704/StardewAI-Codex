# Arquitetura minima

## Runtime

- `src/main.ts` monta a shell HTML e sobe o `Phaser.Game`.
- `src/game/config.ts` concentra renderer, resolucao, scale e fisica.
- `src/game/scenes/FarmScene.ts` orquestra preload, mapa, player, camera, colisao e interacoes.
- `src/chat/` concentra o modal HTML de chat, a ponte de eventos com o jogo e a chamada ao backend local.

## Dados

- `src/game/data/worldData.ts` gera as camadas do mundo, metadados da casa e estados do canteiro.
- `src/game/data/interactionData.ts` define os alvos interativos do slice.
- `src/shared/npcChat.ts` define o contrato de sessao, mensagens e metadados do NPC para cliente e servidor.

## Backend local

- `server/index.ts` expoe `health`, criacao de sessao e envio de mensagem para o chat do NPC.
- `server/lib/sessionStore.ts` persiste as conversas fora do repositorio do jogo.
- `server/lib/codexCli.ts` resolve a entrada do Codex CLI, monta o prompt do NPC e captura a resposta final por arquivo, em modo leitura ou construtor.

## UI

- `src/game/ui/DialogUi.ts` desenha a caixa de dialogo reutilizavel fixa na camera.
- O chat do NPC e um modal DOM fora do canvas, para permitir textarea, scroll e persistencia de sessao com baixo custo no runtime do Phaser.

## Assets

- `public/assets/world/` contem o tileset curado do mundo.
- `public/assets/characters/` contem as folhas compactas de player e NPC.
- `public/assets/raw/` guarda os arquivos de origem para rastreabilidade.

## Fluxo de jogo

1. A cena carrega o tileset e monta o mapa por dados.
2. O player nasce em frente a casa e pode andar pelo mundo.
3. A camera segue o player e a colisao bloqueia areas invalidas.
4. O sistema de proximidade escolhe a interacao ativa.
5. `E` abre dialogo estatico, altera estado do mundo ou dispara o modal de chat do NPC.
6. O backend local consulta o Codex CLI em modo leitura ou construtor, conforme o toggle do chat, e devolve a resposta contextual ao jogador.
