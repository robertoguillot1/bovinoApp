import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Camera, Image as ImageIcon, X, BrainCircuit, Sparkles } from 'lucide-react';
import { consultVeterinarian } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  image?: string;
  timestamp: string;
}

const VeterinaryAI: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hola, soy el asistente veterinario de BovineGuard. 🩺\n\nEstoy aquí para ayudarte a identificar síntomas o dudas sobre el animal **ID ${id || 'Desconocido'}**.\n\nPuedes escribirme los síntomas o enviarme una foto de la afección.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    // Call Gemini
    const responseText = await consultVeterinarian(
        input || "Analiza esta imagen por favor.", 
        userMsg.image
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white font-display">
      {/* Header */}
      <header className="flex-none p-4 pt-8 bg-surface-dark/95 backdrop-blur-md border-b border-white/5 flex items-center gap-3 z-20">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
             <h1 className="text-lg font-bold">Asistente Veterinario</h1>
             <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">BETA</span>
          </div>
          <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-xs text-gray-400">En línea • Gemini 2.5 Vision</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <BrainCircuit size={20} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Message Bubble */}
              <div 
                className={`px-4 py-3 rounded-2xl relative ${
                  msg.role === 'user' 
                  ? 'bg-primary text-background-dark rounded-tr-none' 
                  : 'bg-surface-dark border border-white/10 rounded-tl-none text-gray-100'
                }`}
              >
                {msg.image && (
                  <img src={msg.image} alt="Upload" className="w-full max-w-[200px] rounded-lg mb-2 border border-black/10" />
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                   {/* Basic markdown parsing for bold text */}
                   {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                   )}
                </div>
              </div>
              
              {/* Timestamp */}
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {msg.role === 'ai' && <Sparkles size={10} className="inline mr-1 text-indigo-400" />}
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
             <div className="bg-surface-dark border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
             </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-background-dark/95 backdrop-blur-md border-t border-white/5">
        {selectedImage && (
          <div className="flex items-center gap-2 mb-3 bg-surface-dark p-2 rounded-lg w-fit border border-white/10 animate-in slide-in-from-bottom-2">
             <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded object-cover" />
             <span className="text-xs text-gray-400">Imagen adjunta</span>
             <button onClick={() => setSelectedImage(null)} className="p-1 hover:bg-white/10 rounded-full ml-2">
                <X size={14} />
             </button>
          </div>
        )}

        <div className="flex items-center gap-2">
            <label className="p-3 rounded-xl bg-surface-dark border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer active:scale-95">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                <Camera size={24} />
            </label>
            
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe los síntomas..."
                    className="w-full h-12 bg-surface-dark border border-white/10 rounded-xl pl-4 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={(!input && !selectedImage) || loading}
                className="p-3 rounded-xl bg-primary text-background-dark font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
                <Send size={24} />
            </button>
        </div>
      </footer>
    </div>
  );
};

export default VeterinaryAI;