# TASK-020 - Integrar modal de chat ao NPC do jogo

- Status: `done`
- Story: [STORY-010](../stories/STORY-010.md)
- Objetivo: conectar o NPC visivel do mapa a um modal de conversa textual com persistencia de sessao no navegador.
- Criterios de aceite:
  - `E` perto do NPC abre modal de conversa
  - mensagens enviadas ao backend retornam respostas do Codex CLI
  - o player fica pausado enquanto o modal estiver aberto
  - a conversa do NPC reabre com o historico da mesma sessao
- Entrega:
  - criado modal HTML de chat com historico, textarea e estados de carregamento
  - `village-npc` convertido para interacao de chat via bridge
  - sessao persistida no navegador por `localStorage` e retomada via backend
