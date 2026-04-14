# AGENTS

## Papel da pasta

Esta pasta e a memoria operacional do projeto.

## Regras locais

- `backlog.md` e o indice mestre do estado atual.
- `epics/`, `stories/` e `tasks/` devem refletir o estado real do codigo.
- `concepts/` guarda regras duraveis e tecnicas; nao duplique esses conteudos em todo arquivo.
- `architecture.md` resume a divisao tecnica atual.
- `next-phase.md` guarda o backlog imediatamente posterior ao slice.
- Sempre que uma task mudar arquitetura, assets, runtime ou fluxo documental, atualize o conceito correspondente.
- Sempre que uma falha for descoberta e corrigida, registre a prevencao em algum `AGENTS.md` aplicavel, nao so no chat.
- Ao atualizar status no `backlog.md`, espelhe o mesmo estado nos arquivos de `epics/`, `stories/` e `tasks/` afetados. Nao trate a tabela do backlog como fonte isolada, porque isso mascara divergencias documentais.

## Estilo documental

- Escreva em portugues, com termos tecnicos em ingles quando fizer sentido.
- Mantenha arquivos curtos, objetivos e facilmente escaneaveis.
- Prefira status reais a texto aspiracional.
