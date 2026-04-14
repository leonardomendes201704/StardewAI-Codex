# TASK-023 - Corrigir conflito de teclado entre chat DOM e Phaser

- Status: `done`
- Story: [STORY-010](../stories/STORY-010.md)
- Objetivo: permitir digitacao normal no chat do NPC sem conflito com os bindings globais de teclado do Phaser.
- Criterios de aceite:
  - `W`, `A`, `S`, `D`, `E` e `Espaco` funcionam no textarea do chat
  - o chat continua enviando com `Enter` e fechando com `Escape`
  - o jogo nao volta a mover o player enquanto o modal estiver aberto
- Entrega:
  - inputs do jogo registrados sem capture global do navegador
  - textarea do chat protegendo propagacao de teclado
  - memoria operacional atualizada para futuros modais DOM sobre Phaser
- Falha encontrada:
  - causa: o Phaser registrava teclas do jogo com capture padrao e ainda criava `space` via `createCursorKeys()`, bloqueando a digitacao no textarea do chat
  - solucao: substituir os bindings por teclas explicitas com `enableCapture: false` e interromper a propagacao no textarea
  - prevencao: todo input DOM que conviver com Phaser deve revisar capture e propagacao antes de publicar a feature
