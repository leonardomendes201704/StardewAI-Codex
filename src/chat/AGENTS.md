# AGENTS

## Papel da pasta

Esta pasta concentra a ponte entre o jogo e a interface HTML de chat do NPC.

## Regras locais

- O chat aqui e UI de navegador, nao UI desenhada dentro do canvas do Phaser.
- A persistencia local de sessao por NPC deve ficar no navegador, e o historico canonico fica no backend.
- Abertura e fechamento do modal devem ser comunicados ao jogo por um bridge explicito, sem acoplamento direto com DOM global solto.
