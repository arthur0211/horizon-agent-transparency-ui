
import React from 'react';
import { ProjectionData, UserData } from '../types';

interface VisualizationPanelProps {
  projectionData: ProjectionData | null;
  userData: UserData;
  currentPhase: number;
  className?: string;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  projectionData,
  userData,
  currentPhase,
  className = ''
}) => {
  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="relative">
        {/* Horizon Animation */}
        <svg width="200" height="120" viewBox="0 0 200 120" className="text-horizon-accent">
          <defs>
            <linearGradient id="horizonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M 0 80 Q 50 60 100 70 T 200 75"
            stroke="url(#horizonGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-horizon"
          />
          <circle cx="100" cy="70" r="3" fill="currentColor" className="animate-pulse-horizon" />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h3 className="section-title">Horizon</h3>
        <p className="text-sm text-horizon-text-secondary max-w-xs">
          Seu plano começará a tomar forma aqui conforme conversamos...
        </p>
      </div>
    </div>
  );

  const renderProgressVisualization = () => {
    if (!userData.personalInfo.income) return renderInitialState();

    const income = userData.personalInfo.income;
    const projectedSavings = income * 0.2 * 12 * 30; // Simple calculation for demo

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="section-title mb-2">Projeção Inicial</h3>
          <p className="text-sm text-horizon-text-secondary">
            Baseado nos dados coletados
          </p>
        </div>

        <div className="space-y-4">
          <div className="agent-card">
            <div className="metadata mb-2">Renda Mensal</div>
            <div className="value-hero">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(income)}
            </div>
          </div>

          <div className="agent-card">
            <div className="metadata mb-2">Projeção 30 Anos</div>
            <div className="value-hero">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
              }).format(projectedSavings)}
            </div>
          </div>
        </div>

        {/* Simple Progress Bar */}
        <div className="space-y-2">
          <div className="metadata">Progresso do Plano</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-horizon-accent h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(currentPhase / 5) * 100}%` }}
            />
          </div>
          <div className="text-xs text-horizon-text-secondary">
            {currentPhase}/5 fases completas
          </div>
        </div>
      </div>
    );
  };

  const renderFullProjection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="section-title mb-2">Sua Projeção</h3>
        <p className="text-sm text-horizon-text-secondary">
          Cenário baseado no seu perfil
        </p>
      </div>

      {/* Chart placeholder - would use Chart.js in real implementation */}
      <div className="h-48 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
        <div className="text-center text-horizon-text-secondary">
          <div className="text-sm">Gráfico de Projeção</div>
          <div className="text-xs mt-1">Chart.js será integrado aqui</div>
        </div>
      </div>

      {renderProgressVisualization()}
    </div>
  );

  return (
    <aside className={`w-96 p-6 border-l border-white/10 ${className}`}>
      {currentPhase >= 4 ? renderFullProjection() : 
       currentPhase >= 2 ? renderProgressVisualization() : 
       renderInitialState()}
    </aside>
  );
};
