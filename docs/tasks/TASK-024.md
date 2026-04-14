# TASK-024 - Melhorar feedback de envio no chat do NPC

- Status: `done`
- Story: [STORY-010](../stories/STORY-010.md)
- Objetivo: deixar o envio do chat mais claro, com feedback visual imediato e sem manter o texto preso no campo enquanto o backend responde.
- Criterios de aceite:
  - o textarea limpa imediatamente ao enviar
  - a mensagem do jogador aparece na conversa antes da resposta do NPC
  - existe um indicador visual claro de processamento enquanto o backend responde
  - em falha de envio, o texto e restaurado para nova tentativa
- Entrega:
  - timeline do chat com feedback otimista de envio
  - placeholder visual de resposta pendente do NPC
  - restauracao do texto no textarea quando a requisicao falha
- Falha encontrada:
  - causa: o fluxo anterior so limpava o campo depois que a resposta chegava, deixando a mensagem presa no textarea e transmitindo sensacao de travamento
  - solucao: aplicar render otimista local, limpar o campo no submit e mostrar um estado pendente na timeline
  - prevencao: fluxos assincronos de chat devem sinalizar progresso dentro da propria conversa, nao apenas no botao
