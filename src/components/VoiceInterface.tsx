
import React from 'react';
import { Mic, Phone } from 'lucide-react';

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
      <div className="text-center text-horizon-text-secondary text-sm py-8">
        Conversa por voz não suportada neste navegador
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      {/* Visual Feedback Circle */}
      {isVoiceMode && (
        <div className="relative">
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
            <div className="absolute inset-4 rounded-full">
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
        </div>
      )}

      {/* Mode Toggle Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleVoiceMode}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            !isVoiceMode 
              ? 'bg-horizon-accent text-white' 
              : 'bg-white/10 text-horizon-text-secondary hover:bg-white/20'
          }`}
          title="Modo Chat"
        >
          <Phone className="w-5 h-5" />
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
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Voice Controls */}
      {isVoiceMode && (
        <div className="flex flex-col items-center space-y-4">
          {isSpeaking ? (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
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
            >
              {isListening ? 'Parar Gravação' : 'Começar a Falar'}
            </button>
          )}

          <div className="text-center text-sm text-horizon-text-secondary">
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
      <div className="flex items-center gap-8 text-sm">
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
