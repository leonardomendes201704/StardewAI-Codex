# Changelog

Todas as mudancas relevantes do projeto sao registradas aqui por task concluida.

## 2026-04-13

### TASK-003

- Criada a base documental do projeto com `README.md`, `CHANGELOG.md`, backlog, epicos, stories, tasks e `AGENTS.md` raiz.
- Formalizado o plano de execucao para o vertical slice com foco em Canvas e PCs fracos.

### TASK-001

- Inicializado o repositorio git local com `origin` apontando para o GitHub.
- Gerado o bootstrap do projeto com Vite e TypeScript.
- Instalado `phaser@3.90.0` e registrado o ambiente base com scripts `dev`, `build` e `preview`.

### TASK-002

- Removido o template visual do Vite e criada a casca inicial do jogo em Phaser.
- Adicionadas `src/game/config.ts` e `src/game/scenes/FarmScene.ts` como estrutura base de runtime.
- Ajustado o HTML/CSS para centralizar o canvas e preparar a evolucao do slice.

### TASK-004

- Criados `AGENTS.md` em `src/game`, `public/assets` e `docs`.
- Criada a base de conceitos em `docs/concepts` para performance, layout, interacao, assets e fluxo documental.
- Refinado o contexto operacional para reduzir custo de entendimento nas proximas tasks.

### TASK-005

- Configurado o runtime principal com `Phaser.CANVAS` como renderer padrao.
- Resolucao interna reduzida para `512x288` com `Scale.FIT` e `CENTER_BOTH`.
- Ativados `pixelArt`, `roundPixels` e Arcade Physics com `30 fps` e `fixedStep`.

### TASK-006

- Definido o orcamento inicial de performance e a rotina de validacao degradada.
- Documentadas restricoes de quantidade de layers, corpos dinamicos e carga de assets.
- Formalizada a validacao com `--disable-gpu` e CPU throttling moderado.

### TASK-007

- Pesquisados e baixados os assets CC0-base do slice.
- Organizados os arquivos brutos em `public/assets/raw`.
- Criado `public/assets/SOURCES.md` para rastrear origem, licenca e papel de cada spritesheet.

### TASK-008

- Gerados assets curados para runtime em `public/assets/world` e `public/assets/characters`.
- Reduzida a folha do mundo para remover area inutil e compactados os frames de personagem usados pelo slice.
- Formalizado o uso de espelhamento horizontal para o movimento para a direita.

### TASK-009

- Criado o mapa base em dados com casa do personagem, lago, caminho e area cultivavel.
- A cena principal passou a montar o mundo real a partir de camadas de tiles.
- Centralizado o layout inicial do slice em `src/game/data/worldData.ts`.

### TASK-010

- Separado o footprint da casa do seu volume visual para preparar colisao mais correta.
- Adicionada a caixa de correio da casa como ancora inicial de interacao.
- Criado `interactionData.ts` para desacoplar pontos de interacao do render da cena.

### TASK-011

- Adicionado o player com animacoes compactas de `idle` e `walk`.
- Implementado controle por `WASD` e setas com normalizacao diagonal.
- Definido spawn inicial do personagem em frente a casa.

### TASK-012

- Ativada a camera seguindo o player com bounds do mundo e `roundPixels`.
- Ligada a colisao do personagem com casa, agua, arvores, pedras e cerca.
- Separado o telhado da casa da base colidivel para melhorar leitura de profundidade.

### TASK-013

- Implementado o detector de proximidade para pontos interativos.
- Adicionado prompt contextual fixo na HUD com ativacao pela tecla `E`.
- Pressionar `E` agora dispara feedback curto no rodape do jogo.

### TASK-014

- Criado `DialogUi` como componente reutilizavel fixo na camera.
- A interacao com `E` passou a abrir e fechar dialogos reais.
- O sistema de interacao agora separa prompt de proximidade e exibicao de conteudo.

### TASK-015

- Expandido o mapa para quatro pontos interativos: placa, caixa de correio, canteiro e NPC.
- Adicionado o NPC visivel ao cenario com dialogo proprio.
- O canteiro agora alterna entre dois estados visuais para provar mudanca de estado no mundo.

### TASK-016

- Consolidada a arquitetura minima do projeto em `docs/architecture.md`.
- Registrado o backlog da proxima fase em `docs/next-phase.md`.
- Fechado o estado dos epicos, stories e tasks do vertical slice atual.

### TASK-017

- Formalizada a regra de registrar falhas encontradas, solucao aplicada e prevencao em `AGENTS.md`.
- Registradas licoes operacionais concretas desta implementacao para evitar repeticao de erro em ciclos futuros.
