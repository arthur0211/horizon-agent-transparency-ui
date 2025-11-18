# 🚀 Plano de Expansão MVP - Planejamento de Aposentadoria com IA

## 📋 Visão Geral

Transformar o protótipo atual em um MVP completamente funcional que permite aos usuários realizar o planejamento completo de aposentadoria através de agentes de IA, com interface de chat e voz, proporcionando uma experiência excepcional.

---

## 🎯 Objetivos do MVP

1. **Conversação Natural**: Usuário conversa naturalmente (texto ou voz) com agente financeiro
2. **Planejamento Completo**: Coleta de dados, análise, projeções e recomendações personalizadas
3. **Experiência Fluida**: Interface intuitiva com feedback visual em tempo real
4. **Precisão**: Cálculos financeiros precisos e projeções realistas
5. **Flexibilidade**: Modo express (resultado rápido) ou modo guiado (detalhado)

---

## 🏗️ Arquitetura Proposta

### Stack Tecnológico

```
Frontend (React + TypeScript)
    ↓
Lovable Cloud (Supabase)
    ↓
Edge Functions
    ↓ ↓ ↓
Gemini Live API  +  ADK Agents  +  Calculadora Financeira
```

### Componentes Principais

1. **Frontend Layers**
   - `VoiceInterface`: Gestão de voz (Gemini Live WebSocket)
   - `ConversationPanel`: Chat textual
   - `AgentHub`: Transparência e controle do agente
   - `VisualizationPanel`: Gráficos e projeções

2. **Backend Layers**
   - Edge Function `gemini-live`: Proxy WebSocket para Gemini Live
   - Edge Function `adk-orchestrator`: Orquestração de agentes ADK
   - Edge Function `financial-calculator`: Cálculos financeiros
   - Supabase Database: Persistência de sessões e dados

3. **Agent Architecture (ADK)**
   - **RootAgent**: Orquestrador principal
   - **DataCollectorAgent**: Coleta de informações do usuário
   - **FinancialAnalystAgent**: Análise e projeções
   - **RecommendationAgent**: Geração de recomendações

---

## 📦 Fase 1: Integração Gemini Live API (Semana 1-2)

### Objetivos
- Substituir speech recognition/TTS atual pelo Gemini Live
- Implementar conversação de voz bidirecional de baixa latência
- Manter compatibilidade com modo texto

### Tarefas Técnicas

#### 1.1 Setup Backend
```typescript
// supabase/functions/gemini-live-proxy/index.ts
```
- [ ] Criar Edge Function para proxy WebSocket
- [ ] Implementar autenticação com tokens efêmeros do Gemini
- [ ] Configurar CORS e headers necessários
- [ ] Implementar reconexão automática
- [ ] Adicionar logging e error handling

#### 1.2 Cliente WebSocket
```typescript
// src/utils/GeminiLiveClient.ts
```
- [ ] Criar classe `GeminiLiveClient` para gerenciar conexão
- [ ] Implementar queue de áudio (envio/recebimento)
- [ ] Configurar AudioContext (PCM 16-bit, 16kHz mono entrada, 24kHz saída)
- [ ] Implementar VAD (Voice Activity Detection)
- [ ] Gerenciar estados: connecting, connected, speaking, listening, error

#### 1.3 Atualizar VoiceInterface
```typescript
// src/components/VoiceInterface.tsx
```
- [ ] Remover hooks `useSpeechRecognition` e `useTextToSpeech`
- [ ] Integrar `GeminiLiveClient`
- [ ] Adicionar indicadores visuais de status (conectando, ouvindo, falando)
- [ ] Implementar fallback para modo texto se WebSocket falhar
- [ ] Adicionar controles: mute, volume, pausar/continuar

#### 1.4 Session Management
```typescript
// src/hooks/useGeminiSession.ts
```
- [ ] Criar hook para gerenciar sessão do Gemini Live
- [ ] Implementar histórico de conversação
- [ ] Sincronizar com estado local (useHorizonState)
- [ ] Persistir sessão no Supabase para continuar depois

### Entregáveis
- ✅ Conversação de voz funcionando end-to-end
- ✅ Latência < 1s para respostas
- ✅ Fallback gracioso para texto
- ✅ Documentação de uso

---

## 🤖 Fase 2: Implementação ADK Agents (Semana 3-4)

### Objetivos
- Criar arquitetura multi-agente especializada
- Implementar orchestração inteligente
- Integrar ferramentas financeiras

### Arquitetura de Agentes

```
RootAgent (LlmAgent)
    ├─ DataCollectorAgent (Sequential)
    │   ├─ PersonalInfoTool
    │   ├─ CurrentSituationTool
    │   └─ GoalsTool
    │
    ├─ FinancialAnalystAgent (Parallel)
    │   ├─ CompoundInterestTool
    │   ├─ InflationAdjustmentTool
    │   ├─ RiskAnalysisTool
    │   └─ ProjectionTool
    │
    └─ RecommendationAgent (LlmAgent)
        ├─ InvestmentStrategyTool
        ├─ RiskMitigationTool
        └─ ActionPlanTool
```

### Tarefas Técnicas

#### 2.1 Setup ADK Backend
```python
# supabase/functions/adk-orchestrator/main.py
```
- [ ] Instalar `google-adk` na edge function
- [ ] Configurar credenciais Gemini API
- [ ] Criar estrutura base de agentes
- [ ] Implementar routing entre agentes

#### 2.2 Agente de Coleta de Dados
```python
# supabase/functions/adk-orchestrator/agents/data_collector.py
```
- [ ] Criar `DataCollectorAgent` (Sequential workflow)
- [ ] Implementar validação de inputs
- [ ] Extrair informações estruturadas das respostas
- [ ] Armazenar no formato `UserData`

**Tools:**
- `PersonalInfoTool`: idade, renda, data de aposentadoria
- `CurrentSituationTool`: patrimônio, dívidas, despesas
- `GoalsTool`: estilo de vida, perfil de risco

#### 2.3 Agente de Análise Financeira
```python
# supabase/functions/adk-orchestrator/agents/financial_analyst.py
```
- [ ] Criar `FinancialAnalystAgent` (Parallel execution)
- [ ] Implementar cálculos financeiros precisos
- [ ] Gerar múltiplos cenários (otimista, realista, pessimista)
- [ ] Calcular probabilidade de sucesso

**Tools:**
- `CompoundInterestTool`: juros compostos
- `InflationAdjustmentTool`: correção por inflação
- `RiskAnalysisTool`: análise de volatilidade
- `ProjectionTool`: projeção temporal

#### 2.4 Agente de Recomendações
```python
# supabase/functions/adk-orchestrator/agents/recommendation.py
```
- [ ] Criar `RecommendationAgent` (LLM-driven)
- [ ] Gerar recomendações personalizadas
- [ ] Criar plano de ação passo-a-passo
- [ ] Sugerir ajustes em tempo real

**Tools:**
- `InvestmentStrategyTool`: estratégias por perfil
- `RiskMitigationTool`: mitigação de riscos
- `ActionPlanTool`: plano de ação concreto

#### 2.5 Root Orchestrator
```python
# supabase/functions/adk-orchestrator/agents/root.py
```
- [ ] Criar `RootAgent` para coordenação
- [ ] Implementar dynamic routing baseado no contexto
- [ ] Gerenciar estado da conversação
- [ ] Implementar transfer entre agentes
- [ ] Adicionar logging de todas as ações

#### 2.6 Integration Layer
```typescript
// src/services/adkService.ts
```
- [ ] Criar serviço para chamar ADK orchestrator
- [ ] Mapear respostas dos agentes para UI
- [ ] Implementar retry logic
- [ ] Cachear resultados quando apropriado

### Entregáveis
- ✅ 3 agentes especializados funcionando
- ✅ Orchestração automática entre agentes
- ✅ Cálculos financeiros precisos
- ✅ Testes unitários para cada agente

---

## 💾 Fase 3: Persistência e Estado (Semana 5)

### Objetivos
- Persistir dados do usuário
- Manter histórico de conversações
- Permitir continuação de sessões

### Tarefas Técnicas

#### 3.1 Schema Database
```sql
-- supabase/migrations/001_initial_schema.sql
```
- [ ] Criar tabela `users` (auth já existe)
- [ ] Criar tabela `planning_sessions`
- [ ] Criar tabela `conversation_history`
- [ ] Criar tabela `user_data`
- [ ] Criar tabela `projections`
- [ ] Configurar RLS policies

#### 3.2 Backend Services
```typescript
// src/services/supabaseService.ts
```
- [ ] CRUD para sessões de planejamento
- [ ] Salvar/carregar dados do usuário
- [ ] Persistir histórico de chat
- [ ] Armazenar projeções calculadas
- [ ] Implementar autosave (a cada 30s)

#### 3.3 State Management
```typescript
// src/hooks/usePersistedState.ts
```
- [ ] Criar hook para sincronizar estado local com Supabase
- [ ] Implementar optimistic updates
- [ ] Adicionar conflict resolution
- [ ] Mostrar indicador de "salvando..."

#### 3.4 Session Recovery
```typescript
// src/components/SessionRecovery.tsx
```
- [ ] Detectar sessão inacabada ao abrir app
- [ ] Mostrar modal perguntando se quer continuar
- [ ] Restaurar estado completo (fase, mensagens, dados)
- [ ] Permitir iniciar nova sessão

### Entregáveis
- ✅ Dados persistidos em tempo real
- ✅ Usuário pode fechar e continuar depois
- ✅ Histórico completo acessível
- ✅ Backup automático

---

## 📊 Fase 4: Visualizações Avançadas (Semana 6)

### Objetivos
- Gráficos interativos e informativos
- Comparação de cenários
- Simulações em tempo real

### Tarefas Técnicas

#### 4.1 Componentes de Visualização
```typescript
// src/components/charts/
```
- [ ] `ProjectionChart`: evolução patrimonial ao longo do tempo
- [ ] `ScenarioComparison`: comparar otimista/realista/pessimista
- [ ] `ContributionImpact`: impacto de aportes mensais
- [ ] `RiskVisualization`: volatilidade e probabilidades
- [ ] `MilestoneTracker`: marcos importantes (inflection points)

#### 4.2 Interatividade
- [ ] Sliders para ajustar parâmetros em tempo real
- [ ] Tooltips informativos
- [ ] Zoom e pan nos gráficos
- [ ] Export para PDF/PNG
- [ ] Modo comparação lado-a-lado

#### 4.3 Dashboard Resumo
```typescript
// src/components/DashboardSummary.tsx
```
- [ ] Cards com métricas principais
- [ ] Indicadores de saúde financeira
- [ ] Alertas e recomendações urgentes
- [ ] Progress bars para objetivos

### Entregáveis
- ✅ 5 tipos de gráficos funcionais
- ✅ Interação em tempo real
- ✅ Dashboard responsivo
- ✅ Export de relatórios

---

## 🎨 Fase 5: UX e Polish (Semana 7)

### Objetivos
- Interface intuitiva e bonita
- Feedback visual rico
- Onboarding efetivo

### Tarefas Técnicas

#### 5.1 Design System
```typescript
// src/design-system/
```
- [ ] Revisar e documentar design tokens
- [ ] Criar componentes reutilizáveis
- [ ] Definir animações e transições
- [ ] Modo claro/escuro refinado

#### 5.2 Onboarding
```typescript
// src/components/Onboarding.tsx
```
- [ ] Tour guiado na primeira visita
- [ ] Explicar conceitos financeiros
- [ ] Demonstrar modo voz vs texto
- [ ] Tooltips contextuais

#### 5.3 Feedback Visual
- [ ] Loading states elegantes
- [ ] Skeleton screens
- [ ] Animações de transição entre fases
- [ ] Celebrações em marcos (confetti quando completa)
- [ ] Micro-interações nos botões e inputs

#### 5.4 Acessibilidade
- [ ] Audit completo com Lighthouse
- [ ] Teclado navigation
- [ ] Screen reader support
- [ ] Contraste adequado
- [ ] Focus indicators claros

#### 5.5 Error Handling
- [ ] Mensagens de erro amigáveis
- [ ] Sugestões de resolução
- [ ] Retry automático quando possível
- [ ] Modo offline parcial

### Entregáveis
- ✅ Lighthouse score > 90
- ✅ Onboarding completo
- ✅ Zero erros não tratados
- ✅ Design system documentado

---

## 🧪 Fase 6: Testes e Qualidade (Semana 8)

### Objetivos
- Cobertura de testes adequada
- Performance otimizada
- Bugs críticos resolvidos

### Tarefas Técnicas

#### 6.1 Testes Unitários
```typescript
// src/__tests__/
```
- [ ] Hooks: `useHorizonState`, `useGeminiSession`
- [ ] Services: cálculos financeiros
- [ ] Components: lógica de negócio
- [ ] Cobertura > 70%

#### 6.2 Testes de Integração
```typescript
// src/__tests__/integration/
```
- [ ] Fluxo completo: dados → projeção
- [ ] Salvar e restaurar sessão
- [ ] Conversação multi-turno
- [ ] Modo express vs guiado

#### 6.3 Testes E2E
```typescript
// e2e/
```
- [ ] Usar Playwright ou Cypress
- [ ] Simular usuário completo
- [ ] Testar modo voz (mock)
- [ ] Testar em diferentes devices

#### 6.4 Performance
- [ ] Lighthouse CI
- [ ] Bundle size analysis
- [ ] Lazy loading de componentes
- [ ] Otimizar imagens e assets
- [ ] Code splitting por rota

#### 6.5 Security
- [ ] Audit de dependências (npm audit)
- [ ] Validação de inputs
- [ ] Rate limiting no backend
- [ ] Secrets não expostos
- [ ] RLS policies testadas

### Entregáveis
- ✅ Cobertura de testes > 70%
- ✅ Zero vulnerabilidades críticas
- ✅ Lighthouse > 90
- ✅ Load time < 3s

---

## 🚀 Fase 7: Deploy e Monitoramento (Semana 9)

### Objetivos
- Deploy em produção
- Monitoramento ativo
- Analytics configurado

### Tarefas Técnicas

#### 7.1 Deploy
- [ ] Configurar domínio customizado
- [ ] Configurar SSL
- [ ] Deploy Lovable Cloud functions
- [ ] Configurar variáveis de ambiente
- [ ] Setup backup database

#### 7.2 Monitoramento
```typescript
// src/utils/monitoring.ts
```
- [ ] Integrar Sentry para error tracking
- [ ] Setup Google Analytics ou Posthog
- [ ] Logs estruturados no backend
- [ ] Alertas para erros críticos
- [ ] Dashboard de métricas

#### 7.3 Analytics
- [ ] Eventos de usuário (início, conclusão)
- [ ] Funil de conversão por fase
- [ ] Tempo médio por fase
- [ ] Taxa de uso de voz vs texto
- [ ] NPS e feedback

#### 7.4 Documentação
```markdown
// docs/
```
- [ ] README atualizado
- [ ] Guia de uso para usuários
- [ ] Documentação técnica
- [ ] API reference
- [ ] Troubleshooting guide

### Entregáveis
- ✅ App em produção
- ✅ Monitoramento ativo 24/7
- ✅ Documentação completa
- ✅ Processo de backup

---

## 📈 Fase 8: Otimizações e Refinamento (Semana 10)

### Objetivos
- Ajustes baseados em feedback real
- Otimizações de performance
- Features adicionais prioritárias

### Tarefas Técnicas

#### 8.1 User Feedback
- [ ] Implementar sistema de feedback in-app
- [ ] Sessões de usabilidade com 5-10 usuários
- [ ] Coletar e priorizar sugestões
- [ ] Iterar sobre pontos de dor

#### 8.2 Performance Tuning
- [ ] Otimizar queries do Supabase
- [ ] Cache estratégico
- [ ] Debounce em inputs
- [ ] Virtualization em listas longas

#### 8.3 Features Prioritárias
- [ ] Compartilhamento de planos (PDF, link)
- [ ] Notificações (email/push)
- [ ] Integração com bancos (Plaid/Belvo)
- [ ] Multi-idioma (i18n)
- [ ] Modo família (múltiplos perfis)

### Entregáveis
- ✅ Feedback loop implementado
- ✅ Performance melhorada em 20%
- ✅ 2-3 features adicionais lançadas
- ✅ Roadmap para v2

---

## 🎯 Métricas de Sucesso do MVP

### Técnicas
- ✅ Uptime > 99%
- ✅ Tempo de resposta voz < 1s
- ✅ Zero erros críticos em produção
- ✅ Lighthouse score > 90

### Produto
- ✅ Taxa de conclusão > 60% (usuários que completam todas as fases)
- ✅ Tempo médio de planejamento < 15 minutos
- ✅ NPS > 50
- ✅ 30% dos usuários usam modo voz

### Negócio
- ✅ 100 usuários ativos no primeiro mês
- ✅ Taxa de retenção > 40% (retornam em 7 dias)
- ✅ Feedback qualitativo positivo
- ✅ Prova de valor (usuários completam planos)

---

## 🛠️ Stack Técnico Detalhado

### Frontend
```json
{
  "framework": "React 18 + TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "state": "React Hooks + Context",
  "charts": "Recharts",
  "audio": "Web Audio API + WebSocket",
  "build": "Vite"
}
```

### Backend
```json
{
  "platform": "Lovable Cloud (Supabase)",
  "database": "PostgreSQL",
  "auth": "Supabase Auth",
  "functions": "Edge Functions (Deno)",
  "storage": "Supabase Storage",
  "ai": "Gemini 2.5 Pro/Flash + ADK"
}
```

### AI/ML
```json
{
  "voice": "Gemini Live API (WebSocket)",
  "orchestration": "Google ADK (Python)",
  "models": "gemini-2.0-flash-exp, gemini-2.5-pro",
  "tools": "Function calling + Custom tools"
}
```

### DevOps
```json
{
  "deploy": "Lovable",
  "monitoring": "Sentry",
  "analytics": "Google Analytics",
  "testing": "Vitest + Playwright"
}
```

---

## 💰 Estimativa de Custos (Mensal)

### Infraestrutura
- Lovable Cloud: ~$25-50 (free tier + overages)
- Gemini API: ~$50-100 (baseado em uso)
- Supabase: ~$0-25 (dentro do free tier para MVP)

### Total MVP: **$75-175/mês** (escala conforme uso)

---

## ⚠️ Riscos e Mitigações

### Risco 1: Latência de voz inaceitável
**Mitigação**: Fallback automático para texto, otimizar payload WebSocket

### Risco 2: Custos de API muito altos
**Mitigação**: Implementar rate limiting, cache agressivo, monitorar custos diariamente

### Risco 3: Complexidade dos agentes ADK
**Mitigação**: Começar simples (1 agente), iterar gradualmente, documentar bem

### Risco 4: Baixa adoção do modo voz
**Mitigação**: Onboarding forte, demonstração clara, UX excepcional no modo voz

### Risco 5: Cálculos financeiros imprecisos
**Mitigação**: Testes extensivos, validação com especialistas, disclaimer claro

---

## 🗓️ Cronograma Resumido

| Semana | Fase | Entregável |
|--------|------|-----------|
| 1-2    | Gemini Live | Voz bidirecional funcionando |
| 3-4    | ADK Agents | 3 agentes especializados |
| 5      | Persistência | Database e estado sincronizado |
| 6      | Visualizações | Gráficos interativos |
| 7      | UX Polish | Interface refinada |
| 8      | Testes | Cobertura > 70% |
| 9      | Deploy | Produção + monitoramento |
| 10     | Refinamento | Feedback loop + features |

**Total: 10 semanas (~2.5 meses)**

---

## 🎓 Recursos de Aprendizado

### Gemini Live API
- [Documentação oficial](https://ai.google.dev/gemini-api/docs/live)
- [Quickstart WebSocket](https://ai.google.dev/gemini-api/docs/live-guide)
- [Exemplos no AI Studio](https://aistudio.google.com/live)

### ADK (Agent Development Kit)
- [Documentação ADK](https://google.github.io/adk-docs/)
- [ADK Python Tutorial](https://google.github.io/adk-docs/get-started/python/)
- [Multi-agent examples](https://google.github.io/adk-docs/agents/multi-agents/)

### Lovable Cloud
- [Cloud features](https://docs.lovable.dev/features/cloud)
- [Edge Functions guide](https://docs.lovable.dev/features/cloud/edge-functions)

---

## 🎉 Próximos Passos Imediatos

1. **Ativar Lovable Cloud** se ainda não estiver ativo
2. **Obter API keys**:
   - Gemini API key do Google AI Studio
   - Configurar secrets no Lovable Cloud
3. **Criar primeira Edge Function** para testar Gemini Live
4. **Prototipar conexão WebSocket** no frontend
5. **Definir schema inicial** do banco de dados

---

## 📝 Notas Finais

Este plano é **iterativo e flexível**. Ajuste prioridades baseado em:
- Feedback dos primeiros usuários
- Limitações técnicas descobertas
- Insights de uso real
- Recursos disponíveis

**Princípio Helix**: Mantenha transparência, permita controle do usuário, priorize resultado sobre processo.

---

**Última atualização**: 2025-11-18
**Versão**: 1.0
**Status**: Pronto para início ✅
