
import React from 'react';
import { Bot, BarChart3, Target, Zap, FileText, Wrench, ClipboardList, Keyboard, Calculator, User, TrendingUp } from 'lucide-react';
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

  return (
    <aside className={`w-80 p-6 border-r border-white/10 space-y-6 ${className}`} role="complementary">
      {/* Agent Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-horizon-accent" />
          <div className="text-lg font-semibold text-white">{agent.name}</div>
          {agent.isProcessing && (
            <div className="w-2 h-2 bg-horizon-accent rounded-full animate-pulse-horizon" />
          )}
        </div>
        <div className="metadata">
          {agent.isActive ? 'ativo agora' : 'standby'}
        </div>
      </div>

      {/* Status Panel */}
      <div className="agent-card space-y-3">
        <div className="metadata">Status</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Progresso:
            </span>
            <span className="text-sm font-medium text-white">{agent.progress}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <Target className="w-4 h-4" />
              Confiança:
            </span>
            <span className="text-sm font-medium text-white">
              {agent.confidence > 0 ? `${agent.confidence}%` : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-horizon-text-secondary flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Estado:
            </span>
            <span className="text-sm font-medium text-white">
              {agent.isProcessing ? 'Processando...' : 'Pronto'}
            </span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-3">
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
              <span className="text-horizon-accent">•</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        <div className="metadata flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          Ferramentas
        </div>
        <div className="space-y-2">
          {agent.tools.map((tool, index) => (
            <div 
              key={index}
              className={`tool-indicator ${tool.isActive ? 'active' : ''}`}
            >
              {getToolIcon(tool.name)}
              <span className="text-sm">{tool.name}</span>
              {tool.isActive && (
                <div className="ml-auto w-2 h-2 bg-horizon-accent rounded-full animate-pulse-horizon" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="space-y-3">
        <div className="metadata flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Fases
        </div>
        <div className="space-y-2">
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
            >
              <div className="flex items-center gap-2">
                <span>{phase.isCompleted ? '✓' : phase.isActive ? '○' : '○'}</span>
                <span className="font-medium">{phase.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-3">
        <div className="metadata flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Atalhos
        </div>
        <div className="space-y-1 text-xs text-horizon-text-secondary">
          <div>⌘K - Comandos rápidos</div>
          <div>Tab - Navegar campos</div>
          <div>Esc - Cancelar ação</div>
        </div>
      </div>
    </aside>
  );
};
