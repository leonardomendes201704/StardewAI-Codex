# AGENTS

## Papel da pasta

Esta pasta concentra a implementacao do jogo em Phaser. Mantenha aqui apenas codigo de runtime, sem misturar documentacao extensa ou assets binarios.

## Regras locais

- `config.ts` deve centralizar as decisoes globais do runtime.
- `scenes/` contem a orquestracao principal do mundo.
- `data/` deve concentrar mapa, tiles e metadados de interacao.
- Estruturas de dados futuras para mapa, colisao e interacoes devem ser explicitas e pequenas.
- Priorize performance previsivel em Canvas.
- Evite criar cenas e sistemas paralelos sem necessidade real.

## Expectativas de design

- O mundo final precisa ter uma casinha do personagem como marco central.
- Interacoes devem ser simples e baratas: proximidade, prompt, tecla e dialogo leve.
- Colisores fixos e camadas estaticas sao preferiveis a logica dinamica custosa.
