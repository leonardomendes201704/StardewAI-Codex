# NPC Chat com Codex CLI

## Objetivo

Transformar o `village-npc` em um interlocutor contextual ao mundo do jogo e ao codigo local do repositorio.

## Arquitetura

- O frontend abre um modal HTML por evento de interacao.
- O backend local persiste sessoes e fala com o `codex exec`.
- O Codex recebe persona do NPC, fatos do mundo, arquivos preferenciais e historico recente.
- A resposta final e lida por `--output-last-message`.

## Memoria

- O navegador persiste apenas o `sessionId` por NPC.
- O backend persiste o historico completo em disco fora do repositorio.
- O Codex nao depende do `resume` nativo; o app reconstrui o contexto a cada turno.

## Restricoes

- Sandbox do Codex sempre em `read-only`.
- Respostas devem ser curtas e apropriadas para UI de jogo.
- O NPC deve dizer quando uma feature ainda nao existe, em vez de inventar.
