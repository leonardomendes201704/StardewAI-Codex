# TASK-025 - Adicionar modo construtor para o NPC editar o jogo

- Status: `done`
- Story: [STORY-010](../stories/STORY-010.md)
- Objetivo: permitir que o NPC deixe de ser apenas consultivo e possa editar o jogo localmente quando o jogador ativar uma permissao explicita.
- Criterios de aceite:
  - o chat mostra se o NPC esta em modo leitura ou construtor
  - o backend usa `read-only` por padrao e `workspace-write` apenas no modo construtor
  - ao perguntar se pode editar o jogo com o modo construtor ativo, o NPC nao deve responder como se estivesse sem permissao
  - o modo construtor nao faz `commit` nem `push` automaticamente
- Entrega:
  - toggle de permissao no modal do chat
  - contrato cliente-servidor ampliado com `mode`
  - prompt do Codex CLI ajustado para aconselhar ou implementar conforme o modo
- Falha encontrada:
  - causa: o backend do NPC estava hardcoded em `read-only`, entao o personagem sempre negava capacidade de edicao mesmo quando a intencao do produto era delegar melhorias ao jogo
  - solucao: separar `read-only` e `builder` como modos explicitos na UI, na API e na invocacao do Codex CLI
  - prevencao: quando um agente local precisar tanto orientar quanto agir, trate permissao de escrita como estado visivel e controlado, nao como detalhe invisivel do backend
