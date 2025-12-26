
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Heart, User, Clock, Check, CheckCheck } from 'lucide-react';
import { marketMessages, marketLikes } from '../mockData';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'messages' | 'alerts'>('messages');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredMessages = marketMessages.filter(msg => 
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLikes = marketLikes.filter(like => 
    like.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    like.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      {/* Header */}
      <header className="p-4 pt-8 bg-surface-dark/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Bandeja de Entrada</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface-darker p-1 rounded-xl border border-white/10">
            <button 
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'messages' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                Mensajes {marketMessages.some(m => m.unread) && <span className="ml-1 text-xs text-red-500">•</span>}
            </button>
            <button 
                onClick={() => setActiveTab('alerts')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'alerts' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                Alertas
            </button>
        </div>
      </header>

      {/* Search */}
      <div className="p-4 pb-2">
          <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'messages' ? "Buscar chats..." : "Buscar alertas..."}
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none transition-all"
              />
          </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'messages' && (
              <div className="space-y-3">
                  {filteredMessages.length === 0 ? (
                      <div className="text-center py-10 opacity-50">
                          <p>No se encontraron mensajes.</p>
                      </div>
                  ) : (
                      filteredMessages.map(msg => (
                          <div 
                              key={msg.id} 
                              onClick={() => navigate(`/chat/${msg.id}`)}
                              className="bg-surface-dark p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer active:scale-[0.99] flex gap-4"
                          >
                              <div className="relative">
                                  <img src={msg.avatar} className="w-12 h-12 rounded-full object-cover" />
                                  {msg.unread && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface-dark"></div>
                                  )}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                      <h3 className={`font-bold truncate ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</h3>
                                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{msg.time}</span>
                                  </div>
                                  <p className="text-xs text-primary font-bold mb-0.5">{msg.item}</p>
                                  <p className={`text-sm truncate ${msg.unread ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>{msg.message}</p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          )}

          {activeTab === 'alerts' && (
              <div className="space-y-3">
                  {filteredLikes.length === 0 ? (
                      <div className="text-center py-10 opacity-50">
                          <p>No hay alertas recientes.</p>
                      </div>
                  ) : (
                      filteredLikes.map(like => (
                          <div key={like.id} className="bg-surface-dark p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                              <div className="relative">
                                  <img src={like.avatar} className="w-12 h-12 rounded-full object-cover opacity-80" />
                                  <div className="absolute -bottom-1 -right-1 bg-red-500 p-1 rounded-full border-2 border-surface-dark text-white">
                                      <Heart size={10} fill="currentColor" />
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm text-gray-200">
                                      A <span className="font-bold text-white">{like.user}</span> le interesó tu publicación <span className="font-bold text-primary">{like.item}</span>.
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                      <Clock size={12} /> {like.time}
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          )}
      </main>
    </div>
  );
};

export default Inbox;
