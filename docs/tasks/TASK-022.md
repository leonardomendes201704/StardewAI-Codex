# TASK-022 - Remover shell HTML e deixar o canvas em tela cheia

- Status: `done`
- Story: [STORY-005](../stories/STORY-005.md)
- Objetivo: eliminar a moldura visual da pagina e fazer o jogo ocupar a viewport inteira com o canvas como unico elemento visivel do runtime.
- Criterios de aceite:
  - a pagina nao exibe cabecalho, card ou borda em volta do jogo
  - o canvas cobre a viewport inteira desde o carregamento inicial
  - o chat do NPC continua funcional sobre o canvas em tela cheia
- Entrega:
  - shell HTML removido de `src/main.ts`
  - CSS simplificado para fullscreen sem moldura
  - escala Phaser ajustada para cobrir a viewport sem barras
- Falha encontrada:
  - causa: o primeiro patch misturou muitas alteracoes e um append no `CHANGELOG.md`, o que fez a aplicacao falhar por contexto textual divergente
  - solucao: reaplicar as mudancas em hunks menores e independentes
  - prevencao: em arquivos longos e append-only, como `CHANGELOG.md`, preferir patches curtos e localizados
