
import React from 'react';
import { PlanningPhase } from '../types';

interface HeaderProps {
  phases: PlanningPhase[];
  currentPhase: number;
}

export const Header: React.FC<HeaderProps> = ({ phases, currentPhase }) => {
  const currentPhaseData = phases.find(phase => phase.id === currentPhase);

  return (
    <header className="flex items-center justify-between p-6 border-b border-white/10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">HORIZON</h1>
        <div className="text-sm text-horizon-text-secondary">
          Seu Planejador de Aposentadoria com IA
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Progress Dots */}
        <div className="flex items-center gap-3">
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
            />
          ))}
        </div>
        
        {/* Current Phase */}
        <div className="text-right">
          <div className="metadata">Fase {currentPhase}/5</div>
          <div className="section-title">{currentPhaseData?.name}</div>
        </div>
      </div>
    </header>
  );
};
