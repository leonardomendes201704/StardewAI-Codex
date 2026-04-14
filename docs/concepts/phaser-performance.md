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

## Validacao

- Build deve funcionar em navegador com `--disable-gpu`.
- O jogo deve permanecer responsivo sob CPU throttling moderado.
