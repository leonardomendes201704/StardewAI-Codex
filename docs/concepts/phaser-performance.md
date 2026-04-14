# Phaser Performance

## Premissa

O projeto deve rodar bem em PCs fracos e sem GPU dedicada.

## Diretrizes

- Renderer alvo: `Phaser.CANVAS`.
- Resolucao interna final alvo: `512x288`, escalada para caber na viewport.
- Evitar shaders, particulas, iluminacao dinamica e efeitos de transparencia pesados.
- Manter baixo o numero de objetos dinamicos.
- Preferir spritesheets pequenos e reuso de frames.
- Usar Arcade Physics apenas para o necessario.

## Orcamento inicial

- 1 cena jogavel ativa.
- Ate 4 camadas logicas de render no mapa final.
- Ate 12 corpos dinamicos simultaneos.
- Ate 8 interacoes ativas no slice.
- Ate 2 spritesheets principais carregados no runtime base: mundo e personagem.
- Evitar alocacoes por frame no loop de update.

## Riscos conhecidos

- O bundle inicial do Phaser ainda e grande para o navegador, entao o foco de otimizacao desta fase e runtime, nao code splitting agressivo.
- O mapa deve permanecer compacto para respeitar CPU e memoria de maquinas fracas.

## Validacao

- Build deve funcionar em navegador com `--disable-gpu`.
- O jogo deve permanecer responsivo sob CPU throttling moderado.
- O renderer nao deve depender de efeitos de WebGL para legibilidade ou gameplay.
