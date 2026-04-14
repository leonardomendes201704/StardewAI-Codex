# TASK-018 - Corrigir binding de teclado e revalidar runtime jogavel

- Status: `done`
- Story: [STORY-006](../stories/STORY-006.md)
- Objetivo: remover o bloqueio de runtime que derrubava o `update()` da `FarmScene` e devolver controle real ao jogador.
- Criterios de aceite:
  - `WASD` e `E` registrados com bindings explicitos e estaveis
  - `update()` executa sem `TypeError` relacionado a `isDown`
  - `npm run build` continua passando apos a correcao
- Falha encontrada:
  - causa: o runtime registrava as teclas com `keyboard.addKeys('W,A,S,D,E')`, mas consumia as propriedades em minusculo, o que deixava `this.keys.a` e afins como `undefined`
  - solucao: trocar o binding implicito por um objeto tipado com `keyboard.addKey(KeyCodes.*)`
  - prevencao: nao depender de casing implicito em bindings do Phaser; registrar a regra no `AGENTS.md` raiz e em `src/game/AGENTS.md`
