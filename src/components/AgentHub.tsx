
import React, { useState } from 'react';
import { Bot, BarChart3, Target, Zap, FileText, Wrench, ClipboardList, Keyboard, Calculator, User, TrendingUp, Edit3, RotateCcw, Plus, X } from 'lucide-react';
import { AgentStatus, PlanningPhase } from '../types';

interface AgentHubProps {
  agent: AgentStatus;
  phases: PlanningPhase[];
  currentPhase: number;
  onPhaseClick: (phaseId: number) => void;
  className?: string;
}

export const AgentHub: React.FC<AgentHubProps> = ({ 
  agent, 
  phases, 
  currentPhase, 
  onPhaseClick,
  className = ''
}) => {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(
    "Analise a situação financeira do usuário com renda de {income} e perfil de risco {risk}. Calcule projeções para aposentadoria considerando inflação de 4% ao ano e rentabilidade média de {return}%."
  );
  const [defaultPrompt] = useState(currentPrompt);
  
  const [isEditingLearning, setIsEditingLearning] = useState(false);
  const [learningNotes, setLearningNotes] = useState([
    'Preferência por explicações detalhadas',
    'Foco em segurança financeira'
  ]);
  const [newLearningNote, setNewLearningNote] = useState('');

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'Calculadora Juros':
        return <Calculator className="w-4 h-4" />;
      case 'Análise Perfil':
        return <User className="w-4 h-4" />;
      case 'Projeção Financeira':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const handlePromptChange = (newPrompt: string) => {
    setCurrentPrompt(newPrompt);
    // TODO: Integrar com updateAgent para aplicar novo prompt
  };

  const restoreDefaultPrompt = () => {
    setCurrentPrompt(defaultPrompt);
    setIsEditingPrompt(false);
  };

  const addLearningNote = () => {
    if (newLearningNote.trim()) {
      setLearningNotes(prev => [...prev, newLearningNote.trim()]);
      setNewLearningNote('');
    }
  };

  const removeLearningNote = (index: number) => {
    setLearningNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLearningNote();
    }
  };

  return (
    <aside 
      className={`w-80 p-6 border-r border-white/10 space-y-6 ${className}`} 
      role="complementary"
      aria-label="Painel do Agente"
    >
      {/* Agent Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-horizon-accent" aria-hidden="true" />
          <div className="text-lg font-semibold text-white" id="agent-name">{agent.name}</div>
          {agent.isProcessing && (
            <div 
              className="w-2 h-2 bg-horizon-accent rounded-full animate-pulse-horizon" 
              aria-label="Processando"
              role="status"
            />
          )}
        </div>
        <div className="metadata" aria-describedby="agent-name">
          {agent.isActive ? 'ativo agora' : 'standby'}
        </div>
      </div>

      {/* Prompt Editor */}
      <div className="agent-card space-y-3" role="region" aria-label="Editor de Comando Interno">
        <div className="flex items-center justify-between">
          <div className="metadata flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Comando Interno
          </div>
          <button
            onClick={() => setIsEditingPrompt(!isEditingPrompt)}
            className="text-xs text-horizon-accent hover:text-white transition-colors"
            aria-label={isEditingPrompt ? "Visualizar prompt" : "Editar prompt"}
          >
            {isEditingPrompt ? 'Ver' : 'Editar'}
          </button>
        </div>
        
        {isEditingPrompt ? (
          <div className="space-y-2">
            <textarea
              value={currentPrompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              className="w-full h-24 horizon-input text-xs resize-none"
              placeholder="Defina como o agente deve analisar e processar as informações..."
              aria-label="Editor de prompt do agente"
            />
            <div className="flex gap-2">
              <button
                onClick={restoreDefaultPrompt}
                className="flex items-center gap-1 text-xs text-horizon-text-secondary hover:text-white transition-colors"
                aria-label="Restaurar prompt padrão"
              >
                <RotateCcw className="w-3 h-3" />
                Restaurar padrão
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-horizon-text-secondary bg-white/5 p-3 rounded border border-white/10">
            {currentPrompt}
          </div>
        )}
      </div>

      {/* Personalization Indicators */}
      <div className="agent-card space-y-3" role="region" aria-label="Indicadores de Personalização">
        <div className="flex items-center justify-between">
          <div className="metadata flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Aprendizado
          </div>
          <button
            onClick={() => setIsEditingLearning(!isEditingLearning)}
            className="text-xs text-horizon-accent hover:text-white transition-colors"
            aria-label={isEditingLearning ? "Visualizar notas" : "Editar notas"}
          >
            {isEditingLearning ? 'Ver' : 'Editar'}
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary">Conversas:</span>
            <span className="text-sm font-medium text-white">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary">Adaptações:</span>
            <span className="text-sm font-medium text-horizon-accent">+{learningNotes.length}</span>
          </div>
          
          {isEditingLearning ? (
            <div className="space-y-2">
              <div className="space-y-1">
                {learningNotes.map((note, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <span className="text-horizon-text-secondary flex-1">• {note}</span>
                    <button
                      onClick={() => removeLearningNote(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      aria-label={`Remover nota: ${note}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearningNote}
                  onChange={(e) => setNewLearningNote(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 horizon-input text-xs"
                  placeholder="Nova nota de aprendizado..."
                  aria-label="Nova nota de aprendizado"
                />
                <button
                  onClick={addLearningNote}
                  disabled={!newLearningNote.trim()}
                  className="text-horizon-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Adicionar nota"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {learningNotes.map((note, index) => (
                <div key={index} className="text-xs text-horizon-text-secondary">
                  • {note}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Panel */}
      <div className="agent-card space-y-3" role="region" aria-label="Status do Agente">
        <div className="metadata">Status</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              Progresso:
            </span>
            <span className="text-sm font-medium text-white" aria-label={`${agent.progress} por cento completo`}>
              {agent.progress}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <Target className="w-4 h-4" aria-hidden="true" />
              Confiança:
            </span>
            <span className="text-sm font-medium text-white">
              {agent.confidence > 0 ? `${agent.confidence}%` : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <Zap className="w-4 h-4" aria-hidden="true" />
              Estado:
            </span>
            <span className="text-sm font-medium text-white">
              {agent.isProcessing ? 'Processando...' : 'Pronto'}
            </span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-3" role="region" aria-label="Raciocínio do Agente">
        <div className="metadata flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Raciocínio
        </div>
        <div className="space-y-2" aria-live="polite">
          {agent.reasoning.map((step, index) => (
            <div 
              key={index} 
              className="text-sm text-horizon-text-secondary flex items-start gap-2"
            >
              <span className="text-horizon-accent" aria-hidden="true">•</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3" role="region" aria-label="Ferramentas do Agente">
        <div className="metadata flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          Ferramentas
        </div>
        <div className="space-y-2" role="list">
          {agent.tools.map((tool, index) => (
            <div 
              key={index}
              className={`tool-indicator ${tool.isActive ? 'active' : ''}`}
              role="listitem"
              aria-label={`${tool.name} - ${tool.isActive ? 'ativa' : 'inativa'}`}
            >
              {getToolIcon(tool.name)}
              <span className="text-sm">{tool.name}</span>
              {tool.isActive && (
                <div 
                  className="ml-auto w-2 h-2 bg-horizon-accent rounded-full animate-pulse-horizon" 
                  aria-label="Em uso"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="space-y-3" role="region" aria-label="Navegação de Fases">
        <div className="metadata flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Fases
        </div>
        <div className="space-y-2" role="list">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => onPhaseClick(phase.id)}
              disabled={phase.id > currentPhase && !phase.isCompleted}
              className={`w-full text-left p-2 rounded text-sm transition-all duration-200 ${
                phase.isActive 
                  ? 'bg-horizon-accent/20 text-horizon-accent border border-horizon-accent/30' 
                  : phase.isCompleted
                    ? 'bg-white/5 text-white hover:bg-white/10 cursor-pointer'
                    : 'bg-white/5 text-horizon-text-secondary cursor-not-allowed opacity-50'
              }`}
              role="listitem"
              aria-label={`Fase ${phase.id}: ${phase.name} - ${phase.isCompleted ? 'completa' : phase.isActive ? 'ativa' : 'pendente'}`}
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true">{phase.isCompleted ? '✓' : phase.isActive ? '○' : '○'}</span>
                <span className="font-medium">{phase.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-3" role="region" aria-label="Atalhos de Teclado">
        <div className="metadata flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Atalhos
        </div>
        <div className="space-y-1 text-xs text-horizon-text-secondary" role="list">
          <div role="listitem">⌘K - Comandos rápidos</div>
          <div role="listitem">Tab - Navegar campos</div>
          <div role="listitem">Esc - Cancelar ação</div>
        </div>
      </div>
    </aside>
  );
};
