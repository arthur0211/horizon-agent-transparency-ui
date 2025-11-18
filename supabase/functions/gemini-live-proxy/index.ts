import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const upgradeHeader = req.headers.get("upgrade") || "";
  
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      socket.close(1008, 'API key not configured');
      return response;
    }

    console.log('WebSocket connection established, connecting to Gemini Live...');

    // Connect to Gemini Live API
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;
    const geminiSocket = new WebSocket(geminiUrl);
    
    // Forward messages from client to Gemini
    socket.onmessage = (event) => {
      try {
        console.log('Received from client:', event.data);
        if (geminiSocket.readyState === WebSocket.OPEN) {
          geminiSocket.send(event.data);
        } else {
          console.error('Gemini socket not ready');
        }
      } catch (error) {
        console.error('Error forwarding to Gemini:', error);
      }
    };

    // Forward messages from Gemini to client
    geminiSocket.onmessage = (event) => {
      try {
        console.log('Received from Gemini:', event.data.substring(0, 200));
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      } catch (error) {
        console.error('Error forwarding to client:', error);
      }
    };

    // Handle Gemini connection open
    geminiSocket.onopen = () => {
      console.log('Connected to Gemini Live API');
      
      // Send initial setup message
      const setupMessage = {
        setup: {
          model: "models/gemini-2.0-flash-exp",
          generation_config: {
            response_modalities: ["AUDIO"],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: {
                  voice_name: "Charon"
                }
              }
            }
          },
          system_instruction: {
            parts: [{
              text: "Você é um assistente financeiro especializado em planejamento de aposentadoria. Seu objetivo é ajudar o usuário a criar um plano completo de aposentadoria através de uma conversa natural e amigável. Faça perguntas claras, ouça atentamente e forneça análises e recomendações personalizadas."
            }]
          }
        }
      };
      
      geminiSocket.send(JSON.stringify(setupMessage));
    };

    // Handle errors
    geminiSocket.onerror = (error) => {
      console.error('Gemini WebSocket error:', error);
      socket.close(1011, 'Gemini connection error');
    };

    // Handle Gemini close
    geminiSocket.onclose = () => {
      console.log('Gemini connection closed');
      socket.close(1000, 'Gemini session ended');
    };

    // Handle client close
    socket.onclose = () => {
      console.log('Client disconnected');
      if (geminiSocket.readyState === WebSocket.OPEN) {
        geminiSocket.close();
      }
    };

    // Handle client error
    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
      if (geminiSocket.readyState === WebSocket.OPEN) {
        geminiSocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error('Error setting up WebSocket:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
