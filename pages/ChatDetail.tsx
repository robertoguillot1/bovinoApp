
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Send, Check, CheckCheck, Paperclip, Camera, X } from 'lucide-react';
import { marketMessages } from '../mockData';

const ChatDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize context from mock data
  const initialMsg = marketMessages.find(m => m.id === id);
  const senderName = initialMsg ? initialMsg.sender : 'Usuario';
  const itemTitle = initialMsg ? initialMsg.item : 'Artículo en Venta';
  
  // Mock Message History (Simulated)
  const [messages, setMessages] = useState([
      { id: '1', text: 'Hola, ¿sigue disponible?', sender: 'them', time: '10:30 AM', read: true },
      { id: '2', text: 'Sí, claro. Está en perfectas condiciones.', sender: 'me', time: '10:35 AM', read: true },
      // Include the initial message text if coming from the Inbox link
      ...(initialMsg ? [{ id: 'init', text: initialMsg.message, sender: 'them', time: initialMsg.time, read: false }] : [])
  ]);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
      // Scroll to bottom on load and new message
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;

      setIsSending(true);
      
      // Simulate network delay
      setTimeout(() => {
          const newMsg = {
              id: Date.now().toString(),
              text: inputText,
              sender: 'me',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: false
          };
          setMessages(prev => [...prev, newMsg]);
          setInputText('');
          setIsSending(false);
      }, 500);
  };

  return (
    <div className="bg-background-dark min-h-screen text-white font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-surface-dark border-b border-white/5 z-20 shadow-sm">
          <div className="flex items-center gap-3 p-4 pt-8">
              <button 
                onClick={() => navigate('/market')} 
                className="p-2 -ml-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                  <ArrowLeft size={24} />
              </button>
              
              {/* Avatar */}
              <div className="relative">
                  <img 
                    src={initialMsg?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100"} 
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-dark"></div>
              </div>

              <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base leading-none truncate">{senderName}</h2>
                  <p className="text-xs text-primary truncate mt-1 font-medium">{itemTitle}</p>
              </div>

              <button className="p-2 rounded-full hover:bg-white/10 text-gray-400">
                  <MoreVertical size={20} />
              </button>
          </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d130e]" ref={scrollRef}>
          {/* Date Separator Mock */}
          <div className="flex justify-center my-4">
              <span className="text-[10px] font-bold text-gray-500 bg-surface-dark px-3 py-1 rounded-full uppercase tracking-wider">Hoy</span>
          </div>

          {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl relative shadow-md text-sm leading-relaxed ${
                      msg.sender === 'me' 
                      ? 'bg-primary text-background-dark rounded-tr-none' 
                      : 'bg-surface-dark border border-white/10 text-gray-100 rounded-tl-none'
                  }`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.sender === 'me' ? 'text-green-900/60' : 'text-gray-500'}`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'me' && (
                              msg.read ? <CheckCheck size={14} /> : <Check size={14} />
                          )}
                      </div>
                  </div>
              </div>
          ))}
      </main>

      {/* Input Area */}
      <footer className="p-3 bg-surface-dark border-t border-white/10">
          <form onSubmit={handleSend} className="flex items-end gap-2">
              <button type="button" className="p-3 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <Paperclip size={20} />
              </button>
              
              <div className="flex-1 bg-surface-darker border border-white/10 rounded-2xl flex items-center min-h-[48px]">
                  <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="w-full bg-transparent border-none outline-none text-sm text-white px-4 py-3 max-h-32 resize-none placeholder-gray-500"
                      rows={1}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend(e);
                          }
                      }}
                  />
                  <button type="button" className="p-3 text-gray-400 hover:text-white">
                      <Camera size={20} />
                  </button>
              </div>

              <button 
                  type="submit" 
                  disabled={!inputText.trim() || isSending}
                  className="p-3 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center h-12 w-12"
              >
                  <Send size={20} className={isSending ? 'animate-pulse' : ''} />
              </button>
          </form>
      </footer>
    </div>
  );
};

export default ChatDetail;
