# AGENTS

## Objetivo

Este repositorio implementa um vertical slice jogavel inspirado em Stardew Valley usando Phaser, com prioridade alta para compatibilidade com PCs fracos e ambientes sem GPU dedicada.

## Regras principais

- Priorize simplicidade de runtime sobre efeitos visuais.
- Trate `Phaser.CANVAS` como renderer padrao deste projeto.
- Toda task concluida deve atualizar backlog, story/task relacionada e `CHANGELOG.md`.
- Quando uma pasta ganhar responsabilidades novas, adicione ou atualize o `AGENTS.md` local correspondente.
- Prefira estruturas de dados explicitas para mapa, interacoes e configuracao.
- Quando uma falha de processo, raciocinio ou implementacao for encontrada e corrigida, registre a licao aprendida no `AGENTS.md` mais relevante antes de encerrar o ciclo.
- Pesquise e pense antes de iterar; o objetivo e reduzir repeticao de erro e aumentar assertividade nas proximas implementacoes.

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

## Licoes operacionais atuais

- `apply_patch` deve ficar restrito a arquivos de texto. Quando o template ou a mudanca envolver binarios, edite o texto por patch e trate binarios com operacoes de shell simples.
- Operacoes de escrita no Git devem ser sequenciais. Nao paralelize `git add`, `git commit` e `git push`, porque isso pode deixar `index.lock` e interromper o ciclo.
- Em PowerShell, nao encadeie comandos com `&&`. Execute `git add`, `git commit` e `git push` em chamadas separadas, porque esse shell pode falhar antes mesmo de iniciar o ciclo de versionamento.
- Ao introduzir Tilemap e Phaser com TypeScript, valide nulabilidade explicitamente antes de usar layers e objetos retornados por fabrica.
- Footprint de colisao deve usar tiles coerentes com a arte final. Nao substitua base visual por preenchimento generico se isso quebrar leitura do mapa.
- Sempre que o loop de `update()` ganhar retorno antecipado, revise se prompt, interacao e outros sistemas ainda rodam nos estados de movimento esperados.
- Bindings de teclado no Phaser devem usar mapeamento explicito com `KeyCodes` ou um objeto nomeado estavel. Nao dependa de casing implicito em `addKeys`, porque isso pode gerar propriedades `undefined` em runtime e derrubar o loop da cena.
- No Windows, integracoes backend com o Codex CLI devem preferir `node <...>/bin/codex.js` ou binario real em vez do alias global do shell. O wrapper do npm pode funcionar no PowerShell e falhar em `child_process.spawn`.
- Antes de validar a stack local completa, confirme que as portas `4173` e `8787` estao livres. Processos antigos de Vite ou backend podem gerar falso negativo de inicializacao.
- Em arquivos textuais longos e append-only, como `CHANGELOG.md`, prefira `apply_patch` em blocos pequenos. Hunks largos falham mais facil por contexto divergente e atrasam o ciclo sem necessidade.
- Quando um input HTML conviver com teclado do Phaser, registre as teclas do jogo com `enableCapture: false` e preserve o foco do campo com `stopPropagation()`. Captura global do Phaser pode bloquear letras e espaco no DOM mesmo com o chat aberto.
