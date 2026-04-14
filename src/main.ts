import Phaser from 'phaser'
import { NpcChatOverlay } from './chat/NpcChatOverlay'
import './style.css'
import { createGameConfig } from './game/config'

const mountNode = document.querySelector<HTMLDivElement>('#app')

if (!mountNode) {
  throw new Error('Elemento #app nao encontrado.')
}

mountNode.innerHTML = `
  <div id="game-root" class="game-root" aria-label="Area principal do jogo"></div>
  <div id="npc-chat-root"></div>
`

const parent = document.querySelector<HTMLDivElement>('#game-root')
const chatRoot = document.querySelector<HTMLDivElement>('#npc-chat-root')

if (!parent || !chatRoot) {
  throw new Error('Elemento #game-root nao encontrado.')
}

new NpcChatOverlay(chatRoot)
new Phaser.Game(createGameConfig(parent))
