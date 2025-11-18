export type GeminiClientState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'listening' 
  | 'speaking' 
  | 'error';

export interface GeminiLiveConfig {
  onStateChange?: (state: GeminiClientState) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAudioData?: (audioData: Int16Array) => void;
  onError?: (error: string) => void;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private state: GeminiClientState = 'disconnected';
  private config: GeminiLiveConfig;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private audioQueue: Int16Array[] = [];
  private isPlayingAudio = false;

  constructor(config: GeminiLiveConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.state !== 'disconnected') {
      throw new Error('Already connected or connecting');
    }

    this.updateState('connecting');

    try {
      // Get project ID from env
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/gemini-live-proxy`;
      
      console.log('Connecting to:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateState('connected');
        this.setupAudioCapture();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateState('error');
        this.config.onError?.(error instanceof Error ? error.message : 'WebSocket error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.cleanup();
        this.updateState('disconnected');
      };
    } catch (error) {
      this.updateState('error');
      this.config.onError?.(error instanceof Error ? error.message : 'Connection failed');
      throw error;
    }
  }

  private async setupAudioCapture(): Promise<void> {
    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create processor for capturing audio
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (this.state === 'listening' || this.state === 'connected') {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16Data = this.floatTo16BitPCM(inputData);
          this.sendAudio(int16Data);
        }
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      console.log('Audio capture setup complete');
    } catch (error) {
      console.error('Error setting up audio:', error);
      this.config.onError?.('Failed to access microphone');
    }
  }

  private floatTo16BitPCM(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }

  private sendAudio(audioData: Int16Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioData.buffer))
    );

    const message = {
      realtime_input: {
        media_chunks: [{
          data: base64Audio,
          mime_type: "audio/pcm"
        }]
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      console.log('Received message type:', message);

      // Handle setup complete
      if (message.setupComplete) {
        console.log('Setup complete, ready to start');
        this.updateState('listening');
        return;
      }

      // Handle server content
      if (message.serverContent) {
        const content = message.serverContent;

        // Handle audio output
        if (content.modelTurn?.parts) {
          for (const part of content.modelTurn.parts) {
            if (part.inlineData?.mimeType === 'audio/pcm' && part.inlineData?.data) {
              this.updateState('speaking');
              this.playAudio(part.inlineData.data);
            }
            
            if (part.text) {
              this.config.onTranscript?.(part.text, true);
            }
          }
        }

        // Handle turn complete
        if (content.turnComplete) {
          console.log('Turn complete');
          this.updateState('listening');
        }
      }

      // Handle interrupted
      if (message.toolCall?.functionCalls) {
        console.log('Function calls:', message.toolCall.functionCalls);
      }

    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private async playAudio(base64Audio: string): Promise<void> {
    try {
      // Decode base64 to Int16Array
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16Data = new Int16Array(bytes.buffer);
      this.audioQueue.push(int16Data);

      if (!this.isPlayingAudio) {
        this.processAudioQueue();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  private async processAudioQueue(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      this.updateState('listening');
      return;
    }

    this.isPlayingAudio = true;
    const audioData = this.audioQueue.shift()!;

    try {
      // Create audio context if needed
      if (!this.audioContext) {
        this.audioContext = new AudioContext({ sampleRate: 24000 });
      }

      // Convert Int16 to Float32
      const float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = audioData[i] / (audioData[i] < 0 ? 0x8000 : 0x7FFF);
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      // Play audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      source.onended = () => {
        this.processAudioQueue();
      };

      source.start(0);
      this.config.onAudioData?.(audioData);
    } catch (error) {
      console.error('Error processing audio:', error);
      this.processAudioQueue(); // Continue with next chunk
    }
  }

  startListening(): void {
    if (this.state === 'connected') {
      this.updateState('listening');
    }
  }

  stopListening(): void {
    if (this.state === 'listening') {
      this.updateState('connected');
    }
  }

  sendText(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const message = {
      client_content: {
        turns: [{
          role: "user",
          parts: [{ text }]
        }],
        turn_complete: true
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  disconnect(): void {
    this.cleanup();
    this.updateState('disconnected');
  }

  private cleanup(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.audioQueue = [];
    this.isPlayingAudio = false;
  }

  private updateState(newState: GeminiClientState): void {
    this.state = newState;
    this.config.onStateChange?.(newState);
  }

  getState(): GeminiClientState {
    return this.state;
  }
}
