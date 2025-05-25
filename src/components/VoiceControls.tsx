
import React from 'react';
import { Mic, MicOff, MessageCircle, Phone, PhoneOff } from 'lucide-react';

interface VoiceControlsProps {
  isVoiceMode: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onToggleVoiceMode: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
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
      <div className="text-sm text-horizon-text-secondary">
        Conversa por voz não suportada neste navegador
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleVoiceMode}
        className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-all duration-200 ${
          isVoiceMode 
            ? 'bg-horizon-accent text-white' 
            : 'bg-white/5 text-horizon-text-secondary hover:text-white hover:bg-white/10'
        }`}
      >
        {isVoiceMode ? <Phone className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        {isVoiceMode ? 'Voz' : 'Texto'}
      </button>

      {isVoiceMode && (
        <>
          {isSpeaking && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              <PhoneOff className="w-4 h-4" />
              Parar
            </button>
          )}

          {!isSpeaking && (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse-horizon'
                  : 'bg-horizon-accent text-white hover:bg-horizon-accent/80'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Parar' : 'Falar'}
            </button>
          )}
        </>
      )}
    </div>
  );
};
