import { useState, useEffect, useRef, useCallback } from 'react';
import { GeminiLiveClient, GeminiClientState } from '../utils/GeminiLiveClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseGeminiSessionReturn {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  messages: Message[];
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  startListening: () => void;
  stopListening: () => void;
  sendText: (text: string) => void;
  state: GeminiClientState;
}

export const useGeminiSession = (): UseGeminiSessionReturn => {
  const [state, setState] = useState<GeminiClientState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const currentTranscriptRef = useRef<string>('');

  const handleStateChange = useCallback((newState: GeminiClientState) => {
    console.log('State changed to:', newState);
    setState(newState);
  }, []);

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    console.log('Transcript:', text, 'Final:', isFinal);
    
    if (isFinal) {
      // Add complete message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: text,
        timestamp: new Date()
      }]);
      currentTranscriptRef.current = '';
    } else {
      // Update current transcript
      currentTranscriptRef.current = text;
    }
  }, []);

  const handleError = useCallback((errorMsg: string) => {
    console.error('Gemini error:', errorMsg);
    setError(errorMsg);
  }, []);

  const connect = useCallback(async () => {
    if (clientRef.current) {
      console.log('Already have a client');
      return;
    }

    try {
      setError(null);
      const client = new GeminiLiveClient({
        onStateChange: handleStateChange,
        onTranscript: handleTranscript,
        onError: handleError,
      });

      clientRef.current = client;
      await client.connect();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMsg);
      throw err;
    }
  }, [handleStateChange, handleTranscript, handleError]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setMessages([]);
    currentTranscriptRef.current = '';
  }, []);

  const startListening = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.startListening();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.stopListening();
    }
  }, []);

  const sendText = useCallback((text: string) => {
    if (clientRef.current) {
      // Add user message
      setMessages(prev => [...prev, {
        role: 'user',
        content: text,
        timestamp: new Date()
      }]);

      clientRef.current.sendText(text);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return {
    isConnected: state === 'connected' || state === 'listening' || state === 'speaking',
    isListening: state === 'listening',
    isSpeaking: state === 'speaking',
    messages,
    error,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
    state,
  };
};
