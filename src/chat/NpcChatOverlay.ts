import { emitNpcChatState, onNpcChatOpen } from './npcChatBridge'
import { ensureNpcSession, fetchNpcChatJob, sendNpcChatMessage, type NpcChatMode } from './npcChatApi'
import {
  getNpcDefinition,
  NPC_MODE_STORAGE_PREFIX,
  NPC_SESSION_STORAGE_PREFIX,
  type NpcChatJobResponse,
  type NpcChatMessage,
} from '../shared/npcChat'

export class NpcChatOverlay {
  private readonly root: HTMLDivElement
  private readonly card: HTMLDivElement
  private readonly title: HTMLHeadingElement
  private readonly subtitle: HTMLParagraphElement
  private readonly status: HTMLParagraphElement
  private readonly modeBar: HTMLDivElement
  private readonly modeDescription: HTMLParagraphElement
  private readonly modeButton: HTMLButtonElement
  private readonly progressPanel: HTMLElement
  private readonly progressPhase: HTMLParagraphElement
  private readonly progressMeta: HTMLParagraphElement
  private readonly progressEvents: HTMLUListElement
  private readonly messages: HTMLDivElement
  private readonly form: HTMLFormElement
  private readonly textarea: HTMLTextAreaElement
  private readonly submitButton: HTMLButtonElement
  private readonly closeButton: HTMLButtonElement
  private readonly disposeOpenListener: () => void
  private currentNpcId: string | null = null
  private currentSessionId: string | null = null
  private currentMessages: NpcChatMessage[] = []
  private mode: NpcChatMode = 'read-only'
  private currentJob: NpcChatJobResponse | null = null
  private pendingBaseMessages: NpcChatMessage[] | null = null
  private pendingOptimisticMessages: NpcChatMessage[] | null = null
  private pendingOriginalMessage: string | null = null
  private pollHandle: number | null = null
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

    this.modeBar = document.createElement('div')
    this.modeBar.className = 'npc-chat-modebar'

    this.modeDescription = document.createElement('p')
    this.modeDescription.className = 'npc-chat-modecopy'

    this.modeButton = document.createElement('button')
    this.modeButton.type = 'button'
    this.modeButton.className = 'npc-chat-modebutton'
    this.modeButton.addEventListener('click', () => this.toggleMode())

    this.modeBar.append(this.modeDescription, this.modeButton)

    this.progressPanel = document.createElement('section')
    this.progressPanel.className = 'npc-chat-progress'
    this.progressPanel.hidden = true

    this.progressPhase = document.createElement('p')
    this.progressPhase.className = 'npc-chat-progress-phase'

    this.progressMeta = document.createElement('p')
    this.progressMeta.className = 'npc-chat-progress-meta'

    this.progressEvents = document.createElement('ul')
    this.progressEvents.className = 'npc-chat-progress-events'

    this.progressPanel.append(this.progressPhase, this.progressMeta, this.progressEvents)

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
    footerHint.textContent =
      'Enter envia, Shift+Enter quebra linha, Esc fecha. Ative edicao se quiser pedir mudancas reais no jogo.'

    this.form.append(this.textarea, this.submitButton)
    this.card.append(
      header,
      this.status,
      this.modeBar,
      this.progressPanel,
      this.messages,
      this.form,
      footerHint,
    )
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
    this.stopPolling()
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

  private renderProgress(job: NpcChatJobResponse | null) {
    if (!job || job.status === 'succeeded' || job.status === 'failed') {
      this.progressPanel.hidden = true
      this.progressPhase.textContent = ''
      this.progressMeta.textContent = ''
      this.progressEvents.replaceChildren()
      return
    }

    const heartbeatAge = this.getAgeInSeconds(job.heartbeatAt)
    const phaseAge = this.getAgeInSeconds(job.updatedAt)
    const statusLabel = heartbeatAge <= 3 ? 'Ativo agora' : `Sem heartbeat recente ha ${heartbeatAge}s`

    this.progressPanel.hidden = false
    this.progressPanel.dataset.mode = job.mode
    this.progressPanel.dataset.status = heartbeatAge <= 3 ? 'alive' : 'stale'
    this.progressPhase.textContent = `${job.phase} - ${job.detail}`
    this.progressMeta.textContent = [
      job.mode === 'builder' ? 'Modo construtor' : 'Modo leitura',
      `Tempo ${this.formatDuration(job.startedAt)}`,
      statusLabel,
      `Ultima mudanca de fase ha ${phaseAge}s`,
    ].join(' | ')

    this.progressEvents.replaceChildren()

    job.events.slice(-4).forEach((event) => {
      const item = document.createElement('li')
      item.className = 'npc-chat-progress-event'
      item.textContent = `${event.message} | ha ${this.getAgeInSeconds(event.createdAt)}s`
      this.progressEvents.append(item)
    })
  }

  private setSendingState(isSending: boolean) {
    this.isSending = isSending
    this.textarea.disabled = isSending
    this.submitButton.disabled = isSending
    this.modeButton.disabled = isSending
    this.submitButton.textContent = isSending ? 'Aguardando...' : 'Enviar'
  }

  private getSessionStorageKey(npcId: string) {
    return `${NPC_SESSION_STORAGE_PREFIX}${npcId}`
  }

  private getModeStorageKey(npcId: string) {
    return `${NPC_MODE_STORAGE_PREFIX}${npcId}`
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

  private loadStoredMode(npcId: string): NpcChatMode {
    try {
      return window.localStorage.getItem(this.getModeStorageKey(npcId)) === 'builder'
        ? 'builder'
        : 'read-only'
    } catch {
      return 'read-only'
    }
  }

  private saveStoredMode(npcId: string, mode: NpcChatMode) {
    try {
      window.localStorage.setItem(this.getModeStorageKey(npcId), mode)
    } catch {
      // Sem persistencia local disponivel; mantem apenas o estado em memoria.
    }
  }

  private syncModeUi() {
    const isBuilder = this.mode === 'builder'
    this.modeBar.dataset.mode = this.mode
    this.modeDescription.textContent = isBuilder
      ? 'Modo construtor ativo. O Vizinho pode editar o jogo localmente quando voce pedir.'
      : 'Somente leitura. O Vizinho explica e inspeciona o codigo, mas nao altera arquivos.'
    this.modeButton.textContent = isBuilder ? 'Desligar edicao' : 'Permitir edicao'
    this.modeButton.setAttribute('aria-pressed', String(isBuilder))
  }

  private toggleMode() {
    if (!this.currentNpcId || this.isSending) {
      return
    }

    this.mode = this.mode === 'builder' ? 'read-only' : 'builder'
    this.saveStoredMode(this.currentNpcId, this.mode)
    this.syncModeUi()
    this.setStatus(
      this.mode === 'builder'
        ? 'Modo construtor ativado. O Vizinho pode mexer no jogo localmente.'
        : 'Modo leitura ativado. O Vizinho voltou a apenas inspecionar o jogo.',
    )
    this.textarea.focus()
  }

  private buildPendingAssistantMessage(job?: NpcChatJobResponse | null) {
    if (job) {
      return `${job.phase}: ${job.detail}`
    }

    return this.mode === 'builder'
      ? 'Vizinho esta preparando o trabalho no jogo...'
      : 'Vizinho esta preparando a resposta...'
  }

  private async open(npcId: string) {
    const npc = getNpcDefinition(npcId)

    if (!npc) {
      return
    }

    this.stopPolling()
    this.currentNpcId = npc.id
    this.currentSessionId = null
    this.currentMessages = []
    this.mode = this.loadStoredMode(npc.id)
    this.root.hidden = false
    this.title.textContent = npc.name
    this.subtitle.textContent = npc.locationSummary
    this.syncModeUi()
    this.renderProgress(null)
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
      this.setStatus(
        this.mode === 'builder'
          ? 'Conversa pronta. Modo construtor ativo para pedidos de mudanca no jogo.'
          : 'Conversa pronta. O NPC pode falar sobre o mundo e sobre o codigo do jogo.',
      )
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

    this.stopPolling()
    this.root.hidden = true
    this.currentNpcId = null
    this.currentSessionId = null
    this.currentMessages = []
    this.textarea.value = ''
    this.setStatus('')
    this.renderProgress(null)
    emitNpcChatState({ isOpen: false, npcId: null })
  }

  private stopPolling() {
    if (this.pollHandle !== null) {
      window.clearTimeout(this.pollHandle)
      this.pollHandle = null
    }

    this.currentJob = null
    this.pendingBaseMessages = null
    this.pendingOptimisticMessages = null
    this.pendingOriginalMessage = null
  }

  private schedulePoll(jobId: string) {
    if (!this.isOpen()) {
      return
    }

    this.pollHandle = window.setTimeout(() => {
      void this.pollJob(jobId)
    }, 1_000)
  }

  private async pollJob(jobId: string) {
    try {
      const job = await fetchNpcChatJob(jobId)

      if (!this.isOpen()) {
        return
      }

      this.currentJob = job
      this.renderProgress(job)

      if (this.pendingOptimisticMessages) {
        this.renderMessages(this.pendingOptimisticMessages, this.buildPendingAssistantMessage(job))
      }

      if (job.status === 'succeeded' && job.messages) {
        this.renderMessages(job.messages)
        this.renderProgress(null)
        this.setStatus('Resposta recebida.')
        this.setSendingState(false)
        this.stopPolling()
        this.textarea.focus()
        return
      }

      if (job.status === 'failed') {
        this.renderMessages(this.pendingBaseMessages ?? this.currentMessages)
        this.renderProgress(null)
        this.textarea.value = this.pendingOriginalMessage ?? ''
        this.setStatus(job.error || 'Falha ao conversar com o NPC.', 'error')
        this.setSendingState(false)
        this.stopPolling()
        this.textarea.focus()
        return
      }

      this.setStatus(
        this.mode === 'builder'
          ? `Vizinho esta trabalhando: ${job.phase.toLowerCase()}.`
          : `Vizinho esta processando: ${job.phase.toLowerCase()}.`,
      )
      this.schedulePoll(jobId)
    } catch (error) {
      if (!this.isOpen()) {
        return
      }

      const failure = error instanceof Error ? error.message : 'Falha ao acompanhar o progresso do chat.'
      this.setStatus(failure, 'error')
      this.renderProgress(this.currentJob)
      this.schedulePoll(jobId)
    }
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

    this.pendingBaseMessages = previousMessages
    this.pendingOptimisticMessages = [...previousMessages, optimisticMessage]
    this.pendingOriginalMessage = message
    this.textarea.value = ''
    this.renderMessages(this.pendingOptimisticMessages, this.buildPendingAssistantMessage())
    this.renderProgress(null)
    this.setSendingState(true)
    this.setStatus(
      this.mode === 'builder'
        ? 'Pedido enviado. Aguardando o Vizinho iniciar o trabalho no jogo...'
        : 'Pedido enviado. Aguardando o Vizinho iniciar a resposta...',
    )

    try {
      const job = await sendNpcChatMessage({
        sessionId: this.currentSessionId,
        message,
        mode: this.mode,
      })

      this.currentJob = job
      this.renderProgress(job)
      this.renderMessages(this.pendingOptimisticMessages, this.buildPendingAssistantMessage(job))
      this.setStatus(
        this.mode === 'builder'
          ? 'Vizinho iniciou o trabalho. Acompanhe fase, heartbeat e tempo ao vivo.'
          : 'Vizinho iniciou a resposta. Acompanhe fase, heartbeat e tempo ao vivo.',
      )
      this.schedulePoll(job.jobId)
    } catch (error) {
      const failure = error instanceof Error ? error.message : 'Falha ao conversar com o NPC.'
      this.renderMessages(previousMessages)
      this.renderProgress(null)
      this.textarea.value = message
      this.setStatus(failure, 'error')
      this.setSendingState(false)
      this.stopPolling()
      this.textarea.focus()
    }
  }

  private getAgeInSeconds(timestamp: string) {
    const ageMs = Math.max(Date.now() - new Date(timestamp).getTime(), 0)
    return Math.floor(ageMs / 1_000)
  }

  private formatDuration(startedAt: string) {
    const elapsedSeconds = this.getAgeInSeconds(startedAt)
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
}
