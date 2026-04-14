# World Layout

## Estrutura esperada

- Uma unica cena principal na fase atual.
- Casinha do personagem como ponto central do mapa.
- Area cultivavel proxima da casa.
- Caminho de acesso legivel.
- Trechos de vegetacao, cercas, agua e pedras para compor navegacao e colisao.

## Regra de composicao

- O mapa deve ser dirigido por dados no repo.
- O layout deve privilegiar leitura rapida e navegacao simples.
- Evite mapa grande demais; densidade vale mais do que extensao.

## Layout atual

- Mapa base com `48x30` tiles de `16x16`
- Casa do personagem posicionada na regiao central-superior
- Lago pequeno a oeste
- Area cultivavel cercada a leste do caminho principal
- Arvores e pedras usadas para quebrar a navegacao
