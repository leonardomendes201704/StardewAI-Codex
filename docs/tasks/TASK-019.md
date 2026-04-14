# TASK-019 - Criar backend local do NPC via Codex CLI

- Status: `done`
- Story: [STORY-009](../stories/STORY-009.md)
- Objetivo: introduzir um backend local que persista sessoes de chat e invoque o `codex exec` em modo leitura.
- Criterios de aceite:
  - servidor HTTP local com endpoints de health, criacao ou rehidratacao de sessao e envio de mensagem
  - sessoes persistidas fora do repositorio do jogo
  - invocacao do `codex exec` via `spawn`, com sandbox `read-only` e resposta final lida por `--output-last-message`
  - scripts de dev e build ajustados para cliente e servidor
- Falha encontrada:
  - causa: o backend tentava invocar `codex` diretamente por `child_process.spawn`, mas no Windows o alias global do npm nao se comportou como o PowerShell e retornou `ENOENT`
  - solucao: resolver a entrada `bin/codex.js` da instalacao global e executa-la via `node`
  - prevencao: registrar no `AGENTS.md` raiz e em `server/AGENTS.md` que integracoes backend no Windows nao devem depender do wrapper global do shell
