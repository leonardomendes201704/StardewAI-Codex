# Interaction Model

## Loop minimo

1. Jogador se aproxima de um alvo.
2. Prompt visual aparece.
3. Jogador pressiona `E`.
4. Dialogo ou resposta curta e exibida.
5. Quando aplicavel, o estado do mundo muda.

## Escopo

- Interacoes devem ser locais e de baixo custo.
- Nada de inventario, crafting ou sistema complexo nesta fase.
- Pelo menos quatro pontos interativos devem existir no slice final.

## Dependencia de locomocao

- O jogador precisa se mover com `WASD` e setas.
- Movimento diagonal deve ser normalizado para nao ficar mais rapido.
