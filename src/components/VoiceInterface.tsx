
import React from 'react';
import { Mic, Phone, AlertCircle } from 'lucide-react';

interface VoiceInterfaceProps {
  isVoiceMode: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onToggleVoiceMode: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isVoiceMode,
  isListening,
  isSpeaking,
  isSupported,
  onToggleVoiceMode,
  onStartListening,
  onStopListening,
  onStopSpeaking,
}) => {
  if (!isSupported) {
    return (
      <div 
        className="text-center py-8 space-y-4"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center justify-center gap-2 text-orange-400">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">Conversa por voz não suportada</span>
        </div>
        <div className="text-sm text-horizon-text-secondary max-w-md mx-auto">
          Seu navegador não suporta reconhecimento de voz. Você pode continuar usando o chat digitando suas respostas.
        </div>
        <div className="text-xs text-horizon-text-secondary">
          Recomendamos Chrome, Edge ou Safari para melhor experiência de voz.
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center py-8 space-y-6"
      role="region"
      aria-label="Interface de voz"
    >
      {/* Visual Feedback Circle */}
      {isVoiceMode && (
        <div className="relative" role="status" aria-live="polite">
          <div className={`w-32 h-32 rounded-full border-2 transition-all duration-300 ${
            isListening 
              ? 'border-horizon-accent animate-pulse-horizon bg-horizon-accent/10' 
              : isSpeaking 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-white/20 bg-white/5'
          }`}>
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isListening 
                ? 'animate-ping bg-horizon-accent/20' 
                : isSpeaking 
                ? 'animate-pulse bg-green-500/20' 
                : ''
            }`} />
            
            {/* Dots pattern similar to the image */}
            <div className="absolute inset-4 rounded-full" aria-hidden="true">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-horizon-accent animate-pulse' 
                      : isSpeaking 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-white/30'
                  }`}
                  style={{
                    transform: `rotate(${i * 9}deg) translateY(-40px)`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Screen reader status */}
          <span className="sr-only">
            {isListening 
              ? 'Escutando sua voz' 
              : isSpeaking 
              ? 'Reproduzindo resposta do agente' 
              : 'Aguardando comando de voz'
            }
          </span>
        </div>
      )}

      {/* Mode Toggle Buttons */}
      <div className="flex items-center gap-4" role="group" aria-label="Alternar modo de interação">
        <button
          type="button"
          onClick={onToggleVoiceMode}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            !isVoiceMode 
              ? 'bg-horizon-accent text-white' 
              : 'bg-white/10 text-horizon-text-secondary hover:bg-white/20'
          }`}
          title="Modo Chat"
          aria-label={`Alternar para modo chat${!isVoiceMode ? ' (ativo)' : ''}`}
          aria-pressed={!isVoiceMode}
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onToggleVoiceMode}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            isVoiceMode 
              ? 'bg-horizon-accent text-white' 
              : 'bg-white/10 text-horizon-text-secondary hover:bg-white/20'
          }`}
          title="Modo Voz"
          aria-label={`Alternar para modo voz${isVoiceMode ? ' (ativo)' : ''}`}
          aria-pressed={isVoiceMode}
        >
          <Mic className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Voice Controls */}
      {isVoiceMode && (
        <div className="flex flex-col items-center space-y-4" role="group" aria-label="Controles de voz">
          {isSpeaking ? (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              aria-label="Parar reprodução da resposta"
            >
              Parar Reprodução
            </button>
          ) : (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-horizon-accent text-white hover:bg-horizon-accent/80'
              }`}
              aria-label={isListening ? 'Parar gravação de voz' : 'Iniciar gravação de voz'}
            >
              {isListening ? 'Parar Gravação' : 'Começar a Falar'}
            </button>
          )}

          <div 
            className="text-center text-sm text-horizon-text-secondary"
            aria-live="polite"
            role="status"
          >
            {isListening 
              ? '🎤 Escutando...' 
              : isSpeaking 
              ? '🔊 Reproduzindo resposta...' 
              : '💬 Clique para começar a conversar por voz'
            }
          </div>
        </div>
      )}

      {/* Mode Labels */}
      <div className="flex items-center gap-8 text-sm" role="group" aria-label="Indicadores de modo atual">
        <div className={`transition-colors duration-200 ${
          !isVoiceMode ? 'text-white font-medium' : 'text-horizon-text-secondary'
        }`}>
          Chat
        </div>
        <div className={`transition-colors duration-200 ${
          isVoiceMode ? 'text-white font-medium' : 'text-horizon-text-secondary'
        }`}>
          Voz
        </div>
      </div>
    </div>
  );
};
