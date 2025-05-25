
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserData } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { VoiceControls } from './VoiceControls';

interface ConversationPanelProps {
  messages: ChatMessage[];
  currentPhase: number;
  userData: UserData;
  onMessage: (content: string) => void;
  onDataUpdate: (section: keyof UserData, data: any) => void;
  className?: string;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  currentPhase,
  userData,
  onMessage,
  onDataUpdate,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: speechSupported,
    error: speechError
  } = useSpeechRecognition();

  const {
    speak,
    isSpeaking,
    stop: stopSpeaking,
    isSupported: ttsSupported
  } = useTextToSpeech();

  const isVoiceSupported = speechSupported && ttsSupported;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle new agent messages in voice mode
  useEffect(() => {
    if (isVoiceMode && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'agent') {
        speak(lastMessage.content);
      }
    }
  }, [messages, isVoiceMode, speak]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript && isVoiceMode) {
      setInputValue(transcript);
      // Auto-submit after a pause
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          handleSubmit(new Event('submit') as any);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [transcript, isVoiceMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setIsValid(false);
      return;
    }

    // Process input based on current phase
    processPhaseInput(inputValue);
    onMessage(inputValue);
    setInputValue('');
    setIsValid(true);
    
    if (isVoiceMode && isListening) {
      stopListening();
    }
  };

  const processPhaseInput = (value: string) => {
    switch (currentPhase) {
      case 1: // Personal Data
        if (value.includes('R$') || /\d+/.test(value)) {
          const income = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
          if (income > 0) {
            onDataUpdate('personalInfo', { income });
            setIsValid(true);
          }
        }
        break;
      case 2: // Current Situation
        // Handle current wealth, expenses, etc.
        break;
      case 3: // Goals
        // Handle lifestyle and risk tolerance
        break;
      default:
        break;
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(parseInt(number));
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format currency for phase 1 (income)
    if (currentPhase === 1 && value) {
      value = formatCurrency(value);
    }
    
    setInputValue(value);
    setIsValid(true);
  };

  const getPlaceholder = () => {
    if (isVoiceMode) {
      return isListening ? 'Escutando...' : 'Clique em "Falar" para responder por voz';
    }
    
    switch (currentPhase) {
      case 1:
        return 'Ex: R$ 8.500';
      case 2:
        return 'Ex: R$ 50.000';
      case 3:
        return 'Ex: Moderado';
      default:
        return 'Digite sua resposta...';
    }
  };

  const getInputHint = () => {
    if (isVoiceMode) {
      return '🎤 Modo de conversa por voz ativo';
    }
    
    switch (currentPhase) {
      case 1:
        return '💡 Ex: R$ 8.500';
      case 2:
        return '💡 Inclua poupança, investimentos, imóveis';
      case 3:
        return '💡 Conservador, Moderado ou Arrojado';
      default:
        return '';
    }
  };

  return (
    <main className={`flex-1 flex flex-col ${className}`}>
      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`animate-slide-up ${
              message.type === 'agent' 
                ? 'text-left' 
                : 'text-right'
            }`}
          >
            <div className={`inline-block max-w-md p-4 rounded-lg ${
              message.type === 'agent'
                ? 'bg-white/5 border border-white/10 text-horizon-text-primary'
                : 'bg-horizon-accent text-white ml-auto'
            }`}>
              <div className="chat-message whitespace-pre-line">
                {message.content}
              </div>
              {message.type === 'agent' && (
                <div className="mt-2 text-xs text-horizon-text-secondary">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10">
        {speechError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-200">
            {speechError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={getPlaceholder()}
              className={`horizon-input ${!isValid ? 'error' : ''} ${isVoiceMode ? 'bg-white/10' : ''}`}
              autoFocus={!isVoiceMode}
              disabled={isVoiceMode && isListening}
            />
            {getInputHint() && (
              <div className="text-sm text-horizon-text-secondary">
                {getInputHint()}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isVoiceMode && (
                <button
                  type="submit"
                  className="horizon-button"
                >
                  Continuar
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="px-4 py-2 text-sm text-horizon-text-secondary hover:text-white transition-colors duration-200"
              >
                Limpar
              </button>
            </div>

            <div className="flex items-center gap-4">
              <VoiceControls
                isVoiceMode={isVoiceMode}
                isListening={isListening}
                isSpeaking={isSpeaking}
                isSupported={isVoiceSupported}
                onToggleVoiceMode={() => setIsVoiceMode(!isVoiceMode)}
                onStartListening={startListening}
                onStopListening={stopListening}
                onStopSpeaking={stopSpeaking}
              />

              <div className="text-sm text-horizon-text-secondary">
                ⌘K Comandos
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
