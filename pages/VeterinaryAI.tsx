import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, Send, Camera, Image as ImageIcon, X, 
    BrainCircuit, Sparkles, Video, Mic, Volume2, 
    Zap, Globe, Search, Play, FileVideo, MapPin, PhoneOff, MicOff 
} from 'lucide-react';
import { consultVeterinarianAdvanced, playAudioResponse, AIQueryMode, getLiveClient } from '../services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  media?: string; // Base64 for Image or Video
  mediaType?: 'image' | 'video';
  timestamp: string;
  sources?: { uri: string; title: string; type: 'web' | 'map' }[];
}

const VeterinaryAI: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Chat State
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIQueryMode>('fast');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hola, soy tu Asistente Veterinario Avanzado. 🩺\n\nAnalizo **imágenes**, **videos** y datos complejos.\n\nSelecciona un modo abajo: \n⚡ **Rápido**: Para dudas simples.\n🧠 **Profundo**: Para diagnósticos complejos (Thinking Mode).\n📍 **Mapas**: Para buscar clínicas o proveedores.\n🎤 **En Vivo**: Conversación de voz real.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Media Upload State
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // --- LIVE API STATE ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [liveStatus, setLiveStatus] = useState('Conectando...');
  const [liveVolume, setLiveVolume] = useState(0); // Visualizer
  
  // Refs for Live API to avoid stale closures
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Cleanup Live Session on Unmount
  useEffect(() => {
      return () => {
          stopLiveSession();
      };
  }, []);

  // --- CHAT HANDLERS ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia(reader.result as string);
        setMediaType(type);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedMedia) || loading) return;

    const currentMedia = selectedMedia;
    const currentMediaType = mediaType;
    const currentMime = mimeType;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      media: currentMedia || undefined,
      mediaType: currentMediaType || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedMedia(null);
    setMediaType(null);
    setLoading(true);

    // Call Advanced Service
    const response = await consultVeterinarianAdvanced(
        { 
            text: userMsg.text || (currentMediaType === 'video' ? "Analiza este video." : "Analiza esta imagen."), 
            image: currentMediaType === 'image' ? currentMedia! : undefined,
            video: currentMediaType === 'video' ? currentMedia! : undefined,
            mimeType: currentMime
        }, 
        mode
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: response.text,
      sources: response.sources,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleTTS = async (text: string, msgId: string) => {
      if (playingAudioId === msgId) return;
      setPlayingAudioId(msgId);
      await playAudioResponse(text);
      setPlayingAudioId(null);
  };

  // --- LIVE API LOGIC ---

  const startLiveSession = async () => {
      setIsLiveActive(true);
      setLiveStatus('Conectando con Gemini Live...');
      
      try {
        const ai = getLiveClient();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass({sampleRate: 16000}); // Input rate
        const outAudioCtx = new AudioContextClass({sampleRate: 24000}); // Output rate
        audioContextRef.current = audioCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Helper functions for Encoding/Decoding
        const encode = (bytes: Uint8Array) => {
            let binary = '';
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
            return btoa(binary);
        };
        
        const decode = (base64: string) => {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
            return bytes;
        };

        const createBlob = (data: Float32Array) => {
             const l = data.length;
             const int16 = new Int16Array(l);
             for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; }
             return {
                 data: encode(new Uint8Array(int16.buffer)),
                 mimeType: 'audio/pcm;rate=16000',
             };
        };

        // Output Audio Scheduling
        let nextStartTime = 0;
        const outputNode = outAudioCtx.createGain();
        outputNode.connect(outAudioCtx.destination);

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setLiveStatus('En línea - Escuchando...');
                    
                    // Setup Audio Input Stream
                    const source = audioCtx.createMediaStreamSource(stream);
                    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        // Visualizer Logic
                        let sum = 0;
                        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                        setLiveVolume(Math.sqrt(sum / inputData.length) * 100);

                        if (isMicMuted) return; // Mute logic check inside loop if needed or just disconnect

                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                    };

                    source.connect(processor);
                    processor.connect(audioCtx.destination);
                    
                    inputSourceRef.current = source;
                    processorRef.current = processor;
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        nextStartTime = Math.max(nextStartTime, outAudioCtx.currentTime);
                        
                        const audioData = decode(base64Audio);
                        // Manual decoding for raw PCM
                        const dataInt16 = new Int16Array(audioData.buffer);
                        const frameCount = dataInt16.length;
                        const buffer = outAudioCtx.createBuffer(1, frameCount, 24000);
                        const channelData = buffer.getChannelData(0);
                        for (let i = 0; i < frameCount; i++) {
                             channelData[i] = dataInt16[i] / 32768.0;
                        }

                        const source = outAudioCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(outputNode);
                        source.start(nextStartTime);
                        nextStartTime += buffer.duration;
                    }
                },
                onclose: () => {
                    setLiveStatus('Desconectado');
                    stopLiveSession();
                },
                onerror: (e) => {
                    console.error(e);
                    setLiveStatus('Error de conexión');
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: "Eres un asistente veterinario experto. Responde de forma hablada, concisa y profesional."
            }
        });

        liveSessionRef.current = sessionPromise;

      } catch (error) {
          console.error("Live API Error", error);
          setLiveStatus('Error al iniciar audio');
      }
  };

  const stopLiveSession = () => {
      // Clean up Audio Contexts and Tracks
      if (inputSourceRef.current) inputSourceRef.current.disconnect();
      if (processorRef.current) processorRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
      
      // Close Gemini Session (No direct close method on promise, relying on page unmount or flag)
      // Ideally we would send a close signal if the SDK supported it explicitly on the session object
      
      setIsLiveActive(false);
      setLiveVolume(0);
  };


  return (
    <div className="flex flex-col h-screen bg-background-dark text-white font-display relative overflow-hidden">
      
      {/* --- LIVE OVERLAY --- */}
      {isLiveActive && (
          <div className="absolute inset-0 z-50 bg-background-dark flex flex-col items-center justify-between py-12 animate-in slide-in-from-bottom-full duration-500">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                      <Mic size={40} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Modo En Vivo</h2>
                  <p className="text-gray-400 font-mono">{liveStatus}</p>
              </div>

              {/* Audio Visualizer Mock */}
              <div className="flex items-center gap-2 h-24">
                  {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-3 bg-white/20 rounded-full transition-all duration-75"
                        style={{ height: `${20 + (Math.random() * liveVolume * 2)}px` }}
                      ></div>
                  ))}
              </div>

              <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-6 rounded-full ${isMicMuted ? 'bg-white text-black' : 'bg-surface-dark border border-white/10 text-white'}`}
                  >
                      {isMicMuted ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                  <button 
                    onClick={stopLiveSession}
                    className="p-6 rounded-full bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-transform"
                  >
                      <PhoneOff size={32} />
                  </button>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="flex-none p-4 pt-8 bg-surface-dark/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                    Vet AI Guard
                    {mode === 'deep' && <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 rounded border border-purple-500/30">THINKING</span>}
                </h1>
                <p className="text-xs text-gray-400">Gemini 3 Pro & Flash 2.5</p>
            </div>
        </div>
        
        {/* Live API Trigger */}
        <button 
            onClick={startLiveSession}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse active:scale-95 transition-transform"
        >
            <Mic size={14} />
            <span>EN VIVO</span>
        </button>
      </header>

      {/* Mode Selector */}
      <div className="flex p-2 bg-surface-dark border-b border-white/5 gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setMode('fast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'fast' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <Zap size={14} fill={mode==='fast' ? "currentColor" : "none"} /> Rápido
          </button>
          <button 
            onClick={() => setMode('deep')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'deep' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <BrainCircuit size={14} /> Pensamiento
          </button>
          <button 
            onClick={() => setMode('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'search' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <Globe size={14} /> Búsqueda
          </button>
          <button 
            onClick={() => setMode('maps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'maps' ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <MapPin size={14} /> Localizar
          </button>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Message Bubble */}
              <div 
                className={`px-4 py-3 rounded-2xl relative shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-primary text-background-dark rounded-tr-none' 
                  : 'bg-surface-dark border border-white/10 rounded-tl-none text-gray-100'
                }`}
              >
                {/* Media Preview in Bubble */}
                {msg.media && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                        {msg.mediaType === 'image' ? (
                            <img src={msg.media} alt="Uploaded" className="max-w-[200px] w-full" />
                        ) : (
                            <div className="bg-black/50 p-4 flex items-center justify-center gap-2 text-white">
                                <FileVideo size={24} />
                                <span className="text-xs">Video analizado</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                   {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                   )}
                </div>

                {/* Sources (Grounding) */}
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1"><Search size={10} /> Fuentes:</p>
                        <div className="flex flex-wrap gap-2">
                            {msg.sources.map((source, idx) => (
                                <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded hover:underline truncate max-w-[150px]">
                                    {source.type === 'map' ? <MapPin size={10} /> : <Globe size={10} />}
                                    {source.title || (source.type === 'map' ? 'Ver Mapa' : 'Enlace')}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
              </div>
              
              {/* Footer Actions (TTS & Time) */}
              <div className="flex items-center gap-2 mt-1 px-1">
                {msg.role === 'ai' && (
                    <button 
                        onClick={() => handleTTS(msg.text, msg.id)}
                        className={`p-1 rounded-full transition-colors ${playingAudioId === msg.id ? 'text-primary animate-pulse' : 'text-gray-500 hover:text-white'}`}
                        disabled={!!playingAudioId}
                    >
                        {playingAudioId === msg.id ? <Volume2 size={12} /> : <Play size={12} fill="currentColor" />}
                    </button>
                )}
                <span className="text-[10px] text-gray-500">
                    {msg.role === 'ai' && <Sparkles size={10} className="inline mr-1 text-indigo-400" />}
                    {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-in fade-in">
             <div className="bg-surface-dark border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                {mode === 'deep' ? (
                     <>
                        <BrainCircuit size={16} className="text-purple-400 animate-pulse" />
                        <span className="text-xs text-purple-300 font-bold">Pensando profundamente...</span>
                     </>
                ) : (
                    <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </>
                )}
             </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-background-dark/95 backdrop-blur-md border-t border-white/5">
        
        {/* Selected Media Preview */}
        {selectedMedia && (
          <div className="flex items-center gap-3 mb-3 bg-surface-dark p-2 rounded-lg w-fit border border-white/10 animate-in slide-in-from-bottom-2">
             {mediaType === 'image' ? (
                 <img src={selectedMedia} alt="Preview" className="w-10 h-10 rounded object-cover" />
             ) : (
                 <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-red-400"><Video size={20} /></div>
             )}
             <span className="text-xs text-gray-400 font-bold">{mediaType === 'video' ? 'Video adjunto' : 'Imagen adjunta'}</span>
             <button onClick={() => { setSelectedMedia(null); setMediaType(null); }} className="p-1 hover:bg-white/10 rounded-full ml-2">
                <X size={14} />
             </button>
          </div>
        )}

        <div className="flex items-end gap-2">
            {/* Attachment Buttons */}
            <div className="flex flex-col gap-2 pb-1">
                <label className="p-2 rounded-full bg-surface-dark border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer active:scale-95">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
                    <Camera size={20} />
                </label>
                <label className="p-2 rounded-full bg-surface-dark border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer active:scale-95">
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileSelect(e, 'video')} />
                    <Video size={20} />
                </label>
            </div>
            
            <div className="flex-1 relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'deep' ? "Describe el caso complejo..." : mode === 'maps' ? "Busca clínicas cercanas..." : "Escribe tu consulta..."}
                    className="w-full h-24 bg-surface-dark border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 resize-none"
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={(!input && !selectedMedia) || loading}
                className="h-12 w-12 mb-6 rounded-xl bg-primary text-background-dark font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
            >
                <Send size={24} />
            </button>
        </div>
      </footer>
    </div>
  );
};

export default VeterinaryAI;