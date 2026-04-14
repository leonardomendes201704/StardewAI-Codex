# StardewAI Codex

Vertical slice 2D inspirado em Stardew Valley, feito com Phaser e otimizado para PCs fracos. Agora o NPC principal tambem pode conversar por texto usando um backend local conectado ao Codex CLI.

## Objetivo

Entregar um cenario jogavel em navegador com:

- mapa top-down com casinha do personagem
- movimentacao com `WASD` e setas
- colisao, camera e interacoes com `E`
- dialogos leves e chat contextual com o NPC
- foco em renderer Canvas para rodar sem GPU dedicada

## Estado atual

- Mapa base com casa, lago, caminho e area cultivavel renderizado por tiles
- Personagem jogavel com movimentacao via `WASD` e setas
- Camera seguindo o personagem e colisao ativa com os principais obstaculos
- Interacoes jogaveis para placa, correio, canteiro e NPC
- Modal de chat para o NPC `Vizinho`, com sessao persistida em disco no backend e reabertura por `localStorage`
- Backend HTTP local que invoca o `codex exec` em modo `read-only` para responder usando o contexto do repositorio

## Requisitos

- Node.js instalado
- `codex` instalado globalmente e autenticado na maquina
- Um navegador moderno

Sanidade minima da CLI:

- `codex --version`

## Scripts

- `npm run dev`: sobe cliente e backend local juntos
- `npm run dev:client`: sobe apenas o Vite
- `npm run dev:server`: sobe apenas o backend local do NPC
- `npm run build`: gera build de cliente e servidor
- `npm run preview`: serve apenas a build do cliente

## Como testar localmente

1. Rode `npm install`
2. Rode `npm run dev`
3. Abra `http://127.0.0.1:4173/`
4. Caminhe ate o `Vizinho` com `WASD` ou setas
5. Pressione `E` para abrir o chat
6. Digite uma mensagem e envie com `Enter`

## Controles

- `WASD` ou setas para movimentacao
- `E` para interagir
- `Enter` envia a mensagem no chat do NPC
- `Shift+Enter` quebra linha no chat
- `Esc` fecha o modal de chat

## Performance

- Renderer padrao: `Phaser.CANVAS`
- Resolucao interna ativa: `512x288`
- `Scale.FIT`, `CENTER_BOTH`, `pixelArt` e `roundPixels` habilitados
- Arcade Physics configurada para `30 fps` com `fixedStep`
- O input de texto do NPC fica fora do canvas, em HTML, para nao sobrecarregar o runtime do Phaser

## Observacoes sobre o chat do NPC

- O backend local usa o repositorio do jogo como contexto de leitura
- O Codex roda com sandbox `read-only`
- As sessoes do NPC ficam fora do repositorio, por padrao em `%LOCALAPPDATA%/StardewAI-Codex/npc-chat`
- `npm run preview` nao sobe o backend; para testar o chat, prefira `npm run dev`

## Documentacao

- Backlog mestre: [docs/backlog.md](docs/backlog.md)
- Epicos: [docs/epics](docs/epics)
- Stories: [docs/stories](docs/stories)
- Tasks: [docs/tasks](docs/tasks)
- Arquitetura: [docs/architecture.md](docs/architecture.md)
- Proxima fase: [docs/next-phase.md](docs/next-phase.md)
- Diretrizes para agentes: [AGENTS.md](AGENTS.md)
