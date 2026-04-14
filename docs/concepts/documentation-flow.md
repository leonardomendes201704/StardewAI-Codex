# Documentation Flow

## Regra por task

Cada task concluida deve atualizar:

- backlog
- task
- story e epic quando o status mudar
- changelog
- contexto aplicavel em `AGENTS.md` e `concepts/`

Quando o backlog mudar o estado de uma entrega, replique o mesmo status nos arquivos detalhados relacionados na mesma task. Backlog e arquivos de detalhe nao podem divergir.

## Regra de aprendizado

Quando uma implementacao falhar, exigir correcao de raciocinio ou expor um erro de processo:

- registrar a causa resumida
- registrar a solucao aplicada
- registrar a regra preventiva para nao repetir o problema

Essa memoria deve ir para o `AGENTS.md` mais proximo do dominio afetado e, quando a licao for transversal, tambem para o `AGENTS.md` raiz.

## Objetivo

Manter o repo legivel para humanos e para agentes sem depender de memoria de chat.
