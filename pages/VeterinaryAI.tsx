import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, Send, Camera, Image as ImageIcon, X, 
    BrainCircuit, Sparkles, Video, Mic, Volume2, 
    Zap, Globe, Search, Play, FileVideo 
} from 'lucide-react';
import { consultVeterinarianAdvanced, playAudioResponse, AIQueryMode } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  media?: string; // Base64 for Image or Video
  mediaType?: 'image' | 'video';
  timestamp: string;
  sources?: { uri: string; title: string }[];
  isReasoning?: boolean; // To show "Thinking..." state
}

const VeterinaryAI: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIQueryMode>('fast');
  
  // Media Upload State
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mimeType, setMimeType] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hola, soy tu Asistente Veterinario Avanzado. 🩺\n\nAnalizo **imágenes**, **videos** y datos complejos.\n\nSelecciona un modo abajo: \n⚡ **Rápido**: Para dudas simples.\n🧠 **Profundo**: Para diagnósticos complejos (Thinking Mode).\n🌐 **Búsqueda**: Para datos actualizados de la web.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // --- HANDLERS ---

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
      if (playingAudioId === msgId) return; // Prevent double click
      setPlayingAudioId(msgId);
      await playAudioResponse(text);
      setPlayingAudioId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white font-display">
      
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
        <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
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
              <Zap size={14} fill={mode==='fast' ? "currentColor" : "none"} /> Rápido (Flash Lite)
          </button>
          <button 
            onClick={() => setMode('deep')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'deep' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <BrainCircuit size={14} /> Pensamiento Profundo (Pro)
          </button>
          <button 
            onClick={() => setMode('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${mode === 'search' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
              <Globe size={14} /> Búsqueda Google
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
                                <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded hover:underline truncate max-w-[150px]">
                                    {source.title || source.uri}
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
                    placeholder={mode === 'deep' ? "Describe el caso complejo..." : "Escribe tu consulta..."}
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