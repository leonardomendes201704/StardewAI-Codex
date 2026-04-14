# AGENTS

## Papel da pasta

Esta pasta concentra a ponte entre o jogo e a interface HTML de chat do NPC.

## Regras locais

- O chat aqui e UI de navegador, nao UI desenhada dentro do canvas do Phaser.
- A persistencia local de sessao por NPC deve ficar no navegador, e o historico canonico fica no backend.
- Abertura e fechamento do modal devem ser comunicados ao jogo por um bridge explicito, sem acoplamento direto com DOM global solto.
- Quando o modal usar o atributo `hidden`, preserve isso no CSS com uma regra explicita como `[hidden] { display: none; }`. Definir `display` fixo na classe base pode reexibir a camada mesmo quando o estado logico estiver fechado.
- Textareas e inputs do chat devem parar a propagacao de teclado para o documento, e o runtime Phaser precisa registrar suas teclas sem capture quando coexistir com o modal. Caso contrario, letras e espaco podem sumir durante a digitacao.
- Envio assincrono no chat deve usar feedback otimista: limpar o campo imediatamente, refletir a mensagem do jogador na timeline e exibir um estado visual de processamento. Deixar o texto preso no textarea durante a espera parece travamento.
- Quando o NPC tiver capacidade opcional de editar o jogo, essa permissao deve aparecer de forma explicita no modal. Nao esconda esse estado so no backend, porque o jogador precisa saber se esta falando com um conselheiro ou com um construtor.
