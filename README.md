# StardewAI Codex

Vertical slice 2D inspirado em Stardew Valley, feito com Phaser e otimizado para PCs fracos.

## Objetivo

Entregar um cenário jogável em navegador com:

- mapa top-down com casinha do personagem
- movimentacao com `WASD` e setas
- colisao, camera e interacoes com `E`
- dialogos leves
- foco em renderer Canvas para rodar sem GPU dedicada

## Estado atual

- Governanca documental inicial criada
- Bootstrap tecnico concluido com Vite, TypeScript, Phaser 3.90 e git remoto configurado
- Estrutura de backlog, epicos, stories e tasks versionada
- Cena principal do Phaser criada no lugar do template padrao do Vite
- Assets CC0-base selecionados e organizados para curadoria
- Assets curados de runtime gerados para mundo, player e NPC
- Mapa base com casa, lago, caminho e area cultivavel renderizado por tiles
- Caixa de correio da casa preparada como primeiro ponto contextual de interacao

## Roadmap do slice

- Fundacao tecnica e governanca documental
- Runtime Canvas otimizado
- Curadoria de assets CC0
- Mapa com casa do personagem
- Player, camera, colisao e interacoes

## Scripts

- `npm run dev`: sobe o ambiente local
- `npm run build`: gera build de producao
- `npm run preview`: serve a build localmente

## Controles planejados

- `WASD` ou setas para movimentacao
- `E` para interagir

## Performance

- Renderer padrao: `Phaser.CANVAS`
- Resolucao interna ativa: `512x288`
- `Scale.FIT`, `CENTER_BOTH`, `pixelArt` e `roundPixels` habilitados
- Arcade Physics configurada para `30 fps` com `fixedStep`
- Sem shaders, particulas pesadas ou pos-processamento

## Validacao degradada

- Rodar `npm run dev`
- Abrir o navegador com `--disable-gpu`
- Confirmar carregamento, renderizacao e resposta de input
- Repetir com CPU throttling moderado nas devtools para validar responsividade minima

## Documentacao

- Backlog mestre: [docs/backlog.md](docs/backlog.md)
- Epicos: [docs/epics](docs/epics)
- Stories: [docs/stories](docs/stories)
- Tasks: [docs/tasks](docs/tasks)
- Diretrizes para agentes: [AGENTS.md](AGENTS.md)
