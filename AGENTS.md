# AGENTS

## Objetivo

Este repositorio implementa um vertical slice jogavel inspirado em Stardew Valley usando Phaser, com prioridade alta para compatibilidade com PCs fracos e ambientes sem GPU dedicada.

## Regras principais

- Priorize simplicidade de runtime sobre efeitos visuais.
- Trate `Phaser.CANVAS` como renderer padrao deste projeto.
- Toda task concluida deve atualizar backlog, story/task relacionada e `CHANGELOG.md`.
- Quando uma pasta ganhar responsabilidades novas, adicione ou atualize o `AGENTS.md` local correspondente.
- Prefira estruturas de dados explicitas para mapa, interacoes e configuracao.

## Comandos

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Fluxo de trabalho

1. Marcar task e story como `in_progress`.
2. Implementar a mudanca.
3. Validar localmente o escopo da task.
4. Atualizar backlog, changelog e contexto.
5. Fazer commit atomico da task.
6. Fazer push para `origin/main`.

## Estrutura documental

- `docs/backlog.md`: indice mestre do projeto
- `docs/epics`: definicao dos epicos
- `docs/stories`: recorte funcional por historia
- `docs/tasks`: unidade de entrega e versionamento

## Contexto incremental

Este arquivo deve permanecer enxuto. Regras especificas por dominio devem viver em:

- `docs/concepts/*.md` para conceitos tecnicos e politicas
- `AGENTS.md` locais nas pastas de codigo, assets e documentacao
