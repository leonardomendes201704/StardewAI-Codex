import Phaser from 'phaser'
import './style.css'
import { createGameConfig } from './game/config'

const mountNode = document.querySelector<HTMLDivElement>('#app')

if (!mountNode) {
  throw new Error('Elemento #app nao encontrado.')
}

mountNode.innerHTML = `
  <div class="app-shell">
    <header class="hud-frame">
      <p class="eyebrow">StardewAI Codex</p>
      <h1>Vertical slice Phaser para PCs fracos</h1>
      <p class="subtitle">
        Mapa jogavel com casinha, caminho, lago, NPC e interacoes por proximidade.
        Use WASD ou setas para andar e E para interagir.
      </p>
    </header>
    <div id="game-root" class="game-root" aria-label="Area principal do jogo"></div>
  </div>
`

const parent = document.querySelector<HTMLDivElement>('#game-root')

if (!parent) {
  throw new Error('Elemento #game-root nao encontrado.')
}

new Phaser.Game(createGameConfig(parent))
