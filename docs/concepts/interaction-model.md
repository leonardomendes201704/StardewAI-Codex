# Interaction Model

## Loop minimo

1. Jogador se aproxima de um alvo.
2. Prompt visual aparece.
3. Jogador pressiona `E`.
4. Resposta curta ou dialogo e exibido.
5. Quando aplicavel, o estado do mundo muda.

## UI de dialogo

- A caixa de dialogo deve ser fixa na camera.
- `E` abre e fecha a interface.
- A mesma UI deve servir para mailbox, placa, canteiro e NPC.
- Pelo menos uma interacao precisa alterar o estado visual do mundo.

## Chat de NPC

- NPC conversavel usa modal HTML fora do canvas, nao a `DialogUi` do Phaser.
- A cena apenas dispara a abertura do chat e pausa a locomocao enquanto o modal estiver aberto.
- A sessao do navegador guarda o `sessionId` por NPC, mas o historico canonico fica persistido no backend local.
- O backend deve repassar a conversa ao Codex CLI em modo `read-only`.

## Escopo

- Interacoes devem ser locais e de baixo custo.
- Nada de inventario, crafting ou sistema complexo nesta fase.
- Pelo menos quatro pontos interativos devem existir no slice final.
- Prompts devem aparecer so quando o jogador entra no raio correto.

## Dependencia de locomocao

- O jogador precisa se mover com `WASD` e setas.
- Movimento diagonal deve ser normalizado para nao ficar mais rapido.
