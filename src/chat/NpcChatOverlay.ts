import { emitNpcChatState, onNpcChatOpen } from './npcChatBridge'
import { ensureNpcSession, sendNpcChatMessage } from './npcChatApi'
import {
  getNpcDefinition,
  NPC_SESSION_STORAGE_PREFIX,
  type NpcChatMessage,
} from '../shared/npcChat'

export class NpcChatOverlay {
  private readonly root: HTMLDivElement
  private readonly card: HTMLDivElement
  private readonly title: HTMLHeadingElement
  private readonly subtitle: HTMLParagraphElement
  private readonly status: HTMLParagraphElement
  private readonly messages: HTMLDivElement
  private readonly form: HTMLFormElement
  private readonly textarea: HTMLTextAreaElement
  private readonly submitButton: HTMLButtonElement
  private readonly closeButton: HTMLButtonElement
  private readonly disposeOpenListener: () => void
  private currentNpcId: string | null = null
  private currentSessionId: string | null = null
  private currentMessages: NpcChatMessage[] = []
  private isSending = false

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div')
    this.root.className = 'npc-chat-overlay'
    this.root.hidden = true

    this.card = document.createElement('div')
    this.card.className = 'npc-chat-card'

    const header = document.createElement('div')
    header.className = 'npc-chat-header'

    const headingGroup = document.createElement('div')

    this.title = document.createElement('h2')
    this.title.className = 'npc-chat-title'
    this.title.textContent = 'NPC'

    this.subtitle = document.createElement('p')
    this.subtitle.className = 'npc-chat-subtitle'
    this.subtitle.textContent = ''

    headingGroup.append(this.title, this.subtitle)

    this.closeButton = document.createElement('button')
    this.closeButton.type = 'button'
    this.closeButton.className = 'npc-chat-close'
    this.closeButton.textContent = 'Fechar'
    this.closeButton.addEventListener('click', () => this.close())

    header.append(headingGroup, this.closeButton)

    this.status = document.createElement('p')
    this.status.className = 'npc-chat-status'
    this.status.textContent = ''

    this.messages = document.createElement('div')
    this.messages.className = 'npc-chat-messages'

    this.form = document.createElement('form')
    this.form.className = 'npc-chat-form'
    this.form.addEventListener('submit', (event) => {
      event.preventDefault()
      void this.handleSubmit()
    })

    this.textarea = document.createElement('textarea')
    this.textarea.className = 'npc-chat-input'
    this.textarea.rows = 3
    this.textarea.placeholder = 'Escreva sua mensagem para o NPC...'
    const stopKeyboardPropagation = (event: KeyboardEvent) => {
      event.stopPropagation()
    }
    this.textarea.addEventListener('keyup', stopKeyboardPropagation)
    this.textarea.addEventListener('keydown', (event) => {
      stopKeyboardPropagation(event)

      if (event.key === 'Escape') {
        event.preventDefault()
        this.close()
        return
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        void this.handleSubmit()
      }
    })

    this.submitButton = document.createElement('button')
    this.submitButton.type = 'submit'
    this.submitButton.className = 'npc-chat-submit'
    this.submitButton.textContent = 'Enviar'

    const footerHint = document.createElement('p')
    footerHint.className = 'npc-chat-hint'
    footerHint.textContent = 'Enter envia, Shift+Enter quebra linha, Esc fecha.'

    this.form.append(this.textarea, this.submitButton)
    this.card.append(header, this.status, this.messages, this.form, footerHint)
    this.root.append(this.card)
    parent.append(this.root)

    document.addEventListener('keydown', (event) => {
      if (!this.isOpen()) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        this.close()
      }
    })

    this.disposeOpenListener = onNpcChatOpen((detail) => {
      void this.open(detail.npcId)
    })
  }

  destroy() {
    this.disposeOpenListener()
  }

  isOpen() {
    return !this.root.hidden
  }

  private setStatus(message: string, tone: 'default' | 'error' = 'default') {
    this.status.textContent = message
    this.status.dataset.tone = tone
  }

  private renderMessages(messages: NpcChatMessage[], pendingAssistantMessage?: string) {
    this.currentMessages = messages
    this.messages.replaceChildren()

    messages.forEach((message) => {
      const bubble = document.createElement('article')
      bubble.className = `npc-chat-bubble npc-chat-bubble--${message.role}`

      const label = document.createElement('p')
      label.className = 'npc-chat-bubble-label'
      label.textContent = message.role === 'assistant' ? this.title.textContent || 'NPC' : 'Voce'

      const content = document.createElement('p')
      content.className = 'npc-chat-bubble-content'
      content.textContent = message.content

      bubble.append(label, content)
      this.messages.append(bubble)
    })

    if (pendingAssistantMessage) {
      const bubble = document.createElement('article')
      bubble.className = 'npc-chat-bubble npc-chat-bubble--assistant npc-chat-bubble--pending'

      const label = document.createElement('p')
      label.className = 'npc-chat-bubble-label'
      label.textContent = this.title.textContent || 'NPC'

      const content = document.createElement('p')
      content.className = 'npc-chat-bubble-content'
      content.textContent = pendingAssistantMessage

      bubble.append(label, content)
      this.messages.append(bubble)
    }

    this.messages.scrollTop = this.messages.scrollHeight
  }

  private setSendingState(isSending: boolean) {
    this.isSending = isSending
    this.textarea.disabled = isSending
    this.submitButton.disabled = isSending
    this.submitButton.textContent = isSending ? 'Enviando...' : 'Enviar'
  }

  private getSessionStorageKey(npcId: string) {
    return `${NPC_SESSION_STORAGE_PREFIX}${npcId}`
  }

  private loadStoredSessionId(npcId: string) {
    try {
      return window.localStorage.getItem(this.getSessionStorageKey(npcId))
    } catch {
      return null
    }
  }

  private saveStoredSessionId(npcId: string, sessionId: string) {
    try {
      window.localStorage.setItem(this.getSessionStorageKey(npcId), sessionId)
    } catch {
      // Sem persistencia local disponivel; o backend continua como fonte de verdade.
    }
  }

  private async open(npcId: string) {
    const npc = getNpcDefinition(npcId)

    if (!npc) {
      return
    }

    this.currentNpcId = npc.id
    this.currentSessionId = null
    this.currentMessages = []
    this.root.hidden = false
    this.title.textContent = npc.name
    this.subtitle.textContent = npc.locationSummary
    this.renderMessages([])
    this.setStatus('Conectando ao backend do NPC...')
    emitNpcChatState({ isOpen: true, npcId: npc.id })
    this.setSendingState(true)

    try {
      const session = await ensureNpcSession({
        npcId,
        sessionId: this.loadStoredSessionId(npcId),
      })

      this.currentSessionId = session.sessionId
      this.saveStoredSessionId(npcId, session.sessionId)
      this.renderMessages(session.messages)
      this.setStatus('Conversa pronta. O NPC pode falar sobre o mundo e sobre o codigo do jogo.')
      this.textarea.focus()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao abrir o chat do NPC.'
      this.setStatus(message, 'error')
    } finally {
      this.setSendingState(false)
    }
  }

  private close() {
    if (!this.isOpen()) {
      return
    }

    this.root.hidden = true
    this.currentNpcId = null
    this.currentSessionId = null
    this.currentMessages = []
    this.textarea.value = ''
    this.setStatus('')
    emitNpcChatState({ isOpen: false, npcId: null })
  }

  private async handleSubmit() {
    if (this.isSending || !this.currentNpcId || !this.currentSessionId) {
      return
    }

    const message = this.textarea.value.trim()

    if (!message) {
      return
    }

    const previousMessages = this.currentMessages
    const optimisticMessage: NpcChatMessage = {
      id: `pending-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    }

    this.textarea.value = ''
    this.renderMessages([...previousMessages, optimisticMessage], 'Vizinho esta pensando...')
    this.setSendingState(true)
    this.setStatus('Mensagem enviada. Vizinho esta pensando...')

    try {
      const response = await sendNpcChatMessage({
        sessionId: this.currentSessionId,
        message,
      })

      this.currentSessionId = response.sessionId
      this.saveStoredSessionId(this.currentNpcId, response.sessionId)
      this.renderMessages(response.messages)
      this.setStatus('Resposta recebida.')
      this.textarea.focus()
    } catch (error) {
      const failure = error instanceof Error ? error.message : 'Falha ao conversar com o NPC.'
      this.renderMessages(previousMessages)
      this.textarea.value = message
      this.textarea.focus()
      this.setStatus(failure, 'error')
    } finally {
      this.setSendingState(false)
    }
  }
}
