# AGENTS

## Papel da pasta

Esta pasta concentra o backend local que conecta o jogo ao Codex CLI.

## Regras locais

- O backend deve expor apenas endpoints fechados para o jogo, sem shell arbitrario.
- Toda execucao do Codex CLI aqui deve usar sandbox `read-only`.
- A resposta final do Codex deve ser lida por `--output-last-message`, nunca por parsing de `stdout` cru.
- As sessoes de chat devem ser persistidas fora do repositorio do jogo.
- O backend deve trabalhar com `spawn` e argumentos explicitos, sem concatenacao de shell.
- Em Windows, prefira invocar o Codex pela entrada JavaScript `bin/codex.js` com `node`, porque o alias global instalado pelo npm nao e confiavel para `spawn`.
