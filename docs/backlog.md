# Backlog

## Visao geral

Projeto: vertical slice Phaser inspirado em Stardew Valley, com foco em performance, mapa com casa do personagem e documentacao orientada a agentes.

## Status dos epicos

| ID | Titulo | Status |
| --- | --- | --- |
| EPIC-001 | Fundacao tecnica e governanca documental | done |
| EPIC-002 | Runtime enxuto e compativel com hardware fraco | done |
| EPIC-003 | Mundo jogavel com casa do personagem | done |
| EPIC-004 | Interacao e acabamento do vertical slice | done |
| EPIC-005 | NPC conversavel com Codex CLI | done |

## Status das stories

| ID | Titulo | Status |
| --- | --- | --- |
| STORY-001 | Projeto inicial executavel e versionado | done |
| STORY-002 | Documentacao viva e contexto para agentes | done |
| STORY-003 | Jogar em PC fraco sem depender de GPU | done |
| STORY-004 | Carregar poucos assets e pouca logica dinamica | done |
| STORY-005 | Explorar um mapa com a casa do personagem | done |
| STORY-006 | Controlar o personagem com fluidez | done |
| STORY-007 | Interagir com o mundo | done |
| STORY-008 | Fechar o slice com documentacao consistente | done |
| STORY-009 | Backend local para chat do NPC | done |
| STORY-010 | Modal de conversa integrado ao NPC | done |
| STORY-011 | Fechamento operacional da integracao de chat | done |

## Status das tasks

| ID | Story | Titulo | Status |
| --- | --- | --- | --- |
| TASK-001 | STORY-001 | Inicializar git local, remoto, Vite, TypeScript, Phaser e scripts | done |
| TASK-002 | STORY-001 | Criar estrutura base do app e cena principal | done |
| TASK-003 | STORY-002 | Criar README, CHANGELOG, backlog, epicos, stories, tasks e AGENTS raiz | done |
| TASK-004 | STORY-002 | Criar AGENTS por pasta-chave e docs conceituais iniciais | done |
| TASK-005 | STORY-003 | Configurar renderer Canvas, scale e fisica base | done |
| TASK-006 | STORY-003 | Definir orcamento de performance e validacao degradada | done |
| TASK-007 | STORY-004 | Pesquisar e organizar spritesheets CC0 | done |
| TASK-008 | STORY-004 | Fazer curadoria e corte dos assets usados | done |
| TASK-009 | STORY-005 | Construir mapa top-down com casa do personagem | done |
| TASK-010 | STORY-005 | Implementar footprint e interacao contextual da casa | done |
| TASK-011 | STORY-006 | Implementar player animado com WASD/setas | done |
| TASK-012 | STORY-006 | Implementar camera, bounds e colisoes | done |
| TASK-013 | STORY-007 | Implementar proximidade, prompt e tecla E | done |
| TASK-014 | STORY-007 | Implementar caixa de dialogo reutilizavel | done |
| TASK-015 | STORY-007 | Criar 4 interacoes prontas com ao menos 1 mudanca de estado | done |
| TASK-016 | STORY-008 | Consolidar docs, arquitetura e backlog da proxima fase | done |
| TASK-017 | STORY-008 | Registrar licoes operacionais e prevencoes no AGENTS | done |
| TASK-018 | STORY-006 | Corrigir binding de teclado e revalidar runtime jogavel | done |
| TASK-019 | STORY-009 | Criar backend local do NPC via Codex CLI | done |
| TASK-020 | STORY-010 | Integrar modal de chat ao NPC do jogo | done |
| TASK-021 | STORY-011 | Consolidar docs e operacao do chat do NPC | done |
| TASK-022 | STORY-005 | Remover shell HTML e deixar o canvas em tela cheia | done |
| TASK-023 | STORY-010 | Corrigir conflito de teclado entre chat DOM e Phaser | done |
| TASK-024 | STORY-010 | Melhorar feedback de envio no chat do NPC | done |
| TASK-025 | STORY-010 | Adicionar modo construtor para o NPC editar o jogo | done |

## Ordem de execucao ajustada

Para manter o historico legivel desde o primeiro push, a governanca documental foi antecipada antes do bootstrap tecnico completo.
