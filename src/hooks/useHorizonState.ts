
import { useState, useCallback } from 'react';
import { AgentStatus, PlanningPhase, UserData, ChatMessage, ProjectionData, Command } from '../types';

const initialPhases: PlanningPhase[] = [
  { id: 1, name: 'Dados Pessoais', title: 'Perfil Inicial', isCompleted: false, isActive: true, description: 'Coletando suas informações básicas' },
  { id: 2, name: 'Situação Atual', title: 'Análise Financeira', isCompleted: false, isActive: false, description: 'Avaliando sua situação atual' },
  { id: 3, name: 'Objetivos', title: 'Metas e Sonhos', isCompleted: false, isActive: false, description: 'Definindo seus objetivos' },
  { id: 4, name: 'Projeção', title: 'Cenários Futuros', isCompleted: false, isActive: false, description: 'Calculando projeções' },
  { id: 5, name: 'Recomendações', title: 'Plano de Ação', isCompleted: false, isActive: false, description: 'Estratégias personalizadas' },
];

const initialAgent: AgentStatus = {
  name: '🤖 AGENTE FINANCEIRO',
  isActive: true,
  progress: 0,
  confidence: 0,
  reasoning: ['Iniciando perfil...', 'Preparando análise...'],
  tools: [
    { name: 'Calculadora Juros', isActive: false, icon: '📊' },
    { name: 'Análise Perfil', isActive: false, icon: '🎯' },
    { name: 'Projeção Financeira', isActive: false, icon: '📈' },
  ],
  isProcessing: false,
};

export const useHorizonState = () => {
  const [phases, setPhases] = useState<PlanningPhase[]>(initialPhases);
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [agent, setAgent] = useState<AgentStatus>(initialAgent);
  const [userData, setUserData] = useState<UserData>({
    personalInfo: {},
    currentSituation: {},
    goals: {},
    projection: {},
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Olá Sofia! 👋\n\nVou te ajudar a construir seu plano de aposentadoria de forma clara e transparente. \n\nPara começar, qual sua renda líquida mensal atual?',
      timestamp: new Date(),
      phase: 1,
    }
  ]);
  const [projectionData, setProjectionData] = useState<ProjectionData | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [focusedPanel, setFocusedPanel] = useState<'conversation' | 'sidebar' | 'visualization'>('conversation');

  const updateAgent = useCallback((updates: Partial<AgentStatus>) => {
    setAgent(prev => ({ ...prev, ...updates }));
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateUserData = useCallback((section: keyof UserData, data: any) => {
    setUserData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const nextPhase = useCallback(() => {
    setPhases(prev => prev.map((phase, index) => {
      if (phase.id === currentPhase) {
        return { ...phase, isCompleted: true, isActive: false };
      }
      if (phase.id === currentPhase + 1) {
        return { ...phase, isActive: true };
      }
      return phase;
    }));
    
    if (currentPhase < 5) {
      setCurrentPhase(prev => prev + 1);
    }
  }, [currentPhase]);

  const goToPhase = useCallback((phaseId: number) => {
    setPhases(prev => prev.map(phase => ({
      ...phase,
      isActive: phase.id === phaseId,
      isCompleted: phase.id < phaseId,
    })));
    setCurrentPhase(phaseId);
  }, []);

  const getCommands = useCallback((): Command[] => [
    {
      id: 'edit-income',
      title: 'Editar Renda Atual',
      description: 'Modificar sua renda mensal',
      shortcut: '⌘+1',
      action: () => goToPhase(1),
      group: 'Edição'
    },
    {
      id: 'recalculate',
      title: 'Recalcular Projeção',
      description: 'Atualizar cálculos com dados atuais',
      shortcut: '⌘+R',
      action: () => {
        updateAgent({ isProcessing: true });
        // Simulate recalculation
        setTimeout(() => updateAgent({ isProcessing: false }), 2000);
      },
      group: 'Ações'
    },
    {
      id: 'export-plan',
      title: 'Baixar Estratégia Completa',
      description: 'Exportar plano em PDF',
      shortcut: '⌘+E',
      action: () => console.log('Exportando...'),
      group: 'Exportar'
    },
  ], [goToPhase, updateAgent]);

  return {
    // State
    phases,
    currentPhase,
    agent,
    userData,
    messages,
    projectionData,
    isCommandPaletteOpen,
    focusedPanel,
    
    // Actions
    updateAgent,
    addMessage,
    updateUserData,
    nextPhase,
    goToPhase,
    setProjectionData,
    setIsCommandPaletteOpen,
    setFocusedPanel,
    getCommands,
  };
};
