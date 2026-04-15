# TASK-027 - Exibir progresso real de jobs longos do NPC

- Status: `done`
- Story: [STORY-010](../stories/STORY-010.md)
- Objetivo: deixar claro para o jogador quando o NPC esta realmente trabalhando em um pedido longo, diferenciando isso de travamento.
- Criterios de aceite:
  - o envio do chat inicia um job consultavel em vez de ficar preso em uma unica requisicao opaca
  - o modal mostra fase atual, heartbeat, tempo decorrido e eventos recentes enquanto o job estiver ativo
  - o feedback continua funcionando tanto em modo leitura quanto em modo construtor
  - em sucesso ou falha, o job encerra e a UI sai do estado de progresso
- Entrega:
  - backend com status de job e polling
  - progresso resumido vindo do `codex exec --json`
  - painel de progresso no modal do chat
- Falha encontrada:
  - causa: o fluxo anterior deixava o usuario preso em um unico placeholder textual, sem qualquer indicacao se o backend ainda estava vivo ou se o NPC tinha avancado de fase
  - solucao: trocar o envio por um job assincrono com heartbeat e fases consultaveis, e renderizar esse estado no modal
  - prevencao: pedidos que podem levar dezenas de segundos precisam expor progresso observavel; uma espera silenciosa parece erro mesmo quando o sistema esta funcionando
