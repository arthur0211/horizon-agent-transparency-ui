
import React, { useEffect, useState } from 'react';
import { useHorizonState } from '../hooks/useHorizonState';
import { Header } from '../components/Header';
import { AgentHub } from '../components/AgentHub';
import { ConversationPanel } from '../components/ConversationPanel';
import { VisualizationPanel } from '../components/VisualizationPanel';
import { CommandPalette } from '../components/CommandPalette';
import { Footer } from '../components/Footer';

const Index = () => {
  const [isExpressMode, setIsExpressMode] = useState(false);
  
  const {
    phases,
    currentPhase,
    agent,
    userData,
    messages,
    projectionData,
    isCommandPaletteOpen,
    focusedPanel,
    updateAgent,
    addMessage,
    updateUserData,
    nextPhase,
    goToPhase,
    setIsCommandPaletteOpen,
    setFocusedPanel,
    getCommands,
  } = useHorizonState();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  // Handle Express Mode
  const handleExpressMode = () => {
    setIsExpressMode(true);
    
    // Jump to projection phase
    goToPhase(4);
    
    // Simulate express analysis
    updateAgent({
      isProcessing: true,
      reasoning: ['Modo Express ativado', 'Gerando projeção com dados padrão...', 'Você pode ajustar os valores depois']
    });

    // Add express mode message
    addMessage({
      type: 'agent',
      content: '⚡ **Modo Express Ativado!**\n\nCriei uma projeção inicial com valores padrão. Você pode ajustar seus dados pessoais abaixo para refinar os resultados:\n\n• Renda atual: R$ 5.000\n• Idade: 30 anos\n• Perfil: Moderado\n\nClique em "Ajustar Dados" para personalizar.',
      phase: 4,
    });

    setTimeout(() => {
      updateAgent({
        isProcessing: false,
        confidence: 85,
        reasoning: ['Projeção gerada', 'Aguardando ajustes do usuário'],
        tools: agent.tools.map(tool => 
          tool.name === 'Projeção Financeira' 
            ? { ...tool, isActive: true }
            : tool
        ),
      });
    }, 2000);
  };

  // Simulate agent responses and progression
  const handleMessage = (content: string) => {
    // Simulate processing
    updateAgent({
      isProcessing: true,
      reasoning: ['Analisando resposta...', 'Processando dados...']
    });

    // Simulate delay and response
    setTimeout(() => {
      let agentResponse = '';
      let newConfidence = agent.confidence;
      let toolUpdates: any = {};

      if (isExpressMode) {
        agentResponse = 'Dados atualizados! Sua nova projeção considera as informações fornecidas. Continue ajustando os valores para refinar ainda mais os resultados.';
        newConfidence = Math.min(95, agent.confidence + 10);
      } else {
        switch (currentPhase) {
          case 1:
            agentResponse = 'Perfeito! Agora vou analisar sua situação financeira atual.\n\nQual o valor aproximado do seu patrimônio atual (poupança, investimentos, imóveis)?';
            newConfidence = 25;
            toolUpdates = {
              tools: agent.tools.map(tool => 
                tool.name === 'Análise Perfil' 
                  ? { ...tool, isActive: true }
                  : tool
              )
            };
            nextPhase();
            break;
          case 2:
            agentResponse = 'Excelente! Agora preciso entender melhor seus objetivos.\n\nQual estilo de vida você gostaria de ter na aposentadoria e qual seu perfil de investimento?';
            newConfidence = 55;
            break;
          case 3:
            agentResponse = 'Perfeito! Com essas informações, vou calcular suas projeções.\n\nProcessando cenários otimizados para seu perfil...';
            newConfidence = 78;
            toolUpdates = {
              tools: agent.tools.map(tool => 
                tool.name === 'Projeção Financeira' 
                  ? { ...tool, isActive: true }
                  : tool
              )
            };
            nextPhase();
            break;
          default:
            agentResponse = 'Obrigado pela informação! Continuando nossa análise...';
        }
      }

      updateAgent({
        isProcessing: false,
        confidence: newConfidence,
        reasoning: ['Resposta processada', 'Atualizando plano...'],
        ...toolUpdates,
      });

      addMessage({
        type: 'agent',
        content: agentResponse,
        phase: currentPhase,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-horizon-dark text-horizon-text-primary w-full">
      <div className="flex flex-col min-h-screen">
        <Header 
          phases={phases} 
          currentPhase={currentPhase} 
          onExpressMode={handleExpressMode}
        />
        
        <div className="flex-1 flex">
          <AgentHub
            agent={agent}
            phases={phases}
            currentPhase={currentPhase}
            onPhaseClick={goToPhase}
            className={focusedPanel !== 'sidebar' ? 'blur-focus' : 'focus-active'}
          />
          
          <ConversationPanel
            messages={messages}
            currentPhase={currentPhase}
            userData={userData}
            onMessage={handleMessage}
            onDataUpdate={updateUserData}
            className={focusedPanel !== 'conversation' ? 'blur-focus' : 'focus-active'}
          />
          
          <VisualizationPanel
            projectionData={projectionData}
            userData={userData}
            currentPhase={currentPhase}
            className={focusedPanel !== 'visualization' ? 'blur-focus' : 'focus-active'}
          />
        </div>
        
        <Footer />
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={getCommands()}
      />
    </div>
  );
};

export default Index;
