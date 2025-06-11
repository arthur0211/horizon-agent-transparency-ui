
import React, { useState } from 'react';
import { Zap, SkipForward } from 'lucide-react';
import { PlanningPhase } from '../types';

interface HeaderProps {
  phases: PlanningPhase[];
  currentPhase: number;
  onExpressMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ phases, currentPhase, onExpressMode }) => {
  const [isExpressModeEnabled, setIsExpressModeEnabled] = useState(false);
  const currentPhaseData = phases.find(phase => phase.id === currentPhase);

  const handleExpressMode = () => {
    setIsExpressModeEnabled(true);
    onExpressMode?.();
  };

  return (
    <header 
      className="flex items-center justify-between p-6 border-b border-white/10"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">HORIZON</h1>
        <div className="text-sm text-horizon-text-secondary">
          Seu Planejador de Aposentadoria com IA
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Express Mode Button */}
        <button
          onClick={handleExpressMode}
          disabled={isExpressModeEnabled}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
            isExpressModeEnabled
              ? 'bg-horizon-accent/20 text-horizon-accent border border-horizon-accent/30'
              : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
          }`}
          aria-label="Ativar modo express para resultado rápido"
          title="Pule para os resultados e preencha os dados depois"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">
              {isExpressModeEnabled ? 'Modo Express Ativo' : 'Resultado Rápido'}
            </span>
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-xs opacity-80">
            {isExpressModeEnabled ? 'Complete os dados abaixo' : 'Preencher depois'}
          </span>
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-3" role="progressbar" aria-label="Progresso das fases">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`progress-dot ${
                phase.isCompleted 
                  ? 'completed' 
                  : phase.isActive 
                    ? 'active' 
                    : ''
              }`}
              title={phase.name}
              aria-label={`Fase ${phase.id}: ${phase.name} - ${
                phase.isCompleted ? 'completa' : phase.isActive ? 'ativa' : 'pendente'
              }`}
            />
          ))}
        </div>
        
        {/* Current Phase */}
        <div className="text-right">
          <div className="metadata" aria-label="Fase atual">Fase {currentPhase}/5</div>
          <div className="section-title">{currentPhaseData?.name}</div>
        </div>
      </div>
    </header>
  );
};
