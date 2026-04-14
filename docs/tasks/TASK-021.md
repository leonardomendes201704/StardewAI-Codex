# TASK-021 - Consolidar docs e operacao do chat do NPC

- Status: `done`
- Story: [STORY-011](../stories/STORY-011.md)
- Objetivo: fechar a integracao com validacao local, instrucoes de uso e memoria operacional para evolucoes futuras.
- Criterios de aceite:
  - README atualizado com requisitos do Codex CLI e fluxo local
  - changelog, backlog e arquitetura refletindo a nova feature
  - licoes operacionais e diretrizes locais registradas para backend e UI de chat
- Entrega:
  - README reescrito para refletir a stack completa com frontend Phaser e backend local do NPC
  - arquitetura, fluxo de interacao e backlog da proxima fase atualizados
  - nova regra operacional registrada para evitar falso negativo por conflito de portas locais
- Falha encontrada:
  - causa: o modal de chat usava o atributo `hidden`, mas a classe base definia `display: grid`, o que reabria visualmente a camada na renderizacao inicial
  - solucao: adicionar uma regra CSS explicita para `.npc-chat-overlay[hidden]`
  - prevencao: registrar em `src/chat/AGENTS.md` que componentes de chat baseados em `hidden` precisam preservar esse estado no CSS
