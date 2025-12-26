
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Filter, Plus, Heart, MapPin, Calendar, Weight, CheckCircle2, SlidersHorizontal, X, DollarSign, ChevronDown, Store, MoreVertical, Edit2, Tag, Trash2, Pause, Play, Eye, MessageSquare, User } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { marketListings, marketMessages, marketLikes } from '../mockData';

interface FilterState {
  sortBy: 'recent' | 'price_asc' | 'price_desc';
  minPrice: string;
  maxPrice: string;
  gender: 'All' | 'Macho' | 'Hembra';
  location: string;
  breed: string;
}

type TabView = 'MyPosts' | 'Global' | 'Favorites';

const Market: React.FC = () => {
  const navigate = useNavigate();
  
  // View State
  const [activeTab, setActiveTab] = useState<TabView>('Global');

  // Inbox/Notification State
  const [showInbox, setShowInbox] = useState(false);
  const [inboxTab, setInboxTab] = useState<'messages' | 'notifications'>('messages');

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize listings merging with localStorage favorites
  const [localListings, setLocalListings] = useState(() => {
      const saved = localStorage.getItem('bovine_favorites');
      const savedIds = saved ? JSON.parse(saved) : [];
      return marketListings.map(item => ({
          ...item,
          isFavorite: savedIds.includes(item.id)
      }));
  });
  
  // UI States
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Applied Filters State
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recent',
    minPrice: '',
    maxPrice: '',
    gender: 'All',
    location: '',
    breed: 'All'
  });

  // Temporary Filters State
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sync favorites
  useEffect(() => {
      const handleStorageChange = () => {
          const saved = localStorage.getItem('bovine_favorites');
          const savedIds = saved ? JSON.parse(saved) : [];
          setLocalListings(prev => prev.map(item => ({
              ...item,
              isFavorite: savedIds.includes(item.id)
          })));
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeFiltersCount = [
    filters.minPrice, 
    filters.maxPrice, 
    filters.location, 
    filters.gender !== 'All', 
    filters.breed !== 'All'
  ].filter(Boolean).length;

  const totalNotifications = marketMessages.filter(m => m.unread).length + marketLikes.length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(price).replace('COP', '').trim();
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLocalListings(prev => {
        const updated = prev.map(item => 
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        );
        const favIds = updated.filter(i => i.isFavorite).map(i => i.id);
        localStorage.setItem('bovine_favorites', JSON.stringify(favIds));
        return updated;
    });
  };

  // --- FILTERING LOGIC ---
  const getDisplayedListings = () => {
      // 1. Base Filter (Tab)
      let baseList = localListings;
      if (activeTab === 'Favorites') {
          baseList = localListings.filter(l => l.isFavorite);
      } else if (activeTab === 'MyPosts') {
          // For demo, we'll simulate "My Posts" 
          return [
            {...marketListings[0], status: 'Active'}, // Active Mock
            {...marketListings[1], status: 'Sold'},   // Sold Mock
            {...marketListings[2], status: 'Inactive'} // Inactive Mock
          ]; 
      }

      // 2. Apply Search & Filters
      return baseList.filter(listing => {
        // Search Query Check
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = listing.title.toLowerCase().includes(query);
            const matchesLocation = listing.location.toLowerCase().includes(query);
            const matchesBreed = listing.stats.breed.toLowerCase().includes(query);
            if (!matchesTitle && !matchesLocation && !matchesBreed) return false;
        }

        // Advanced Filters
        const price = listing.price;
        const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
        const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
        if (price < min || price > max) return false;
        if (filters.gender !== 'All' && listing.stats.gender !== filters.gender) return false;
        if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.breed !== 'All' && !listing.stats.breed.includes(filters.breed)) return false;
        return true;
      }).sort((a, b) => {
          if (filters.sortBy === 'price_asc') return a.price - b.price;
          if (filters.sortBy === 'price_desc') return b.price - a.price;
          return 0; // Default (Recents)
      });
  };

  const displayedListings = getDisplayedListings();

  // Modal Actions
  const openFilterModal = () => {
      setTempFilters({...filters}); 
      setIsFilterOpen(true);
  };

  const applyFilters = () => {
      setFilters(tempFilters);
      setIsFilterOpen(false);
  };

  const clearTempFilters = () => {
      setTempFilters({
        sortBy: 'recent',
        minPrice: '',
        maxPrice: '',
        gender: 'All',
        location: '',
        breed: 'All'
      });
  };

  // Clear Search
  const closeSearch = () => {
      setIsSearchOpen(false);
      setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col pb-20 relative" onClick={() => setShowInbox(false)}>
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-10 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 h-10">
          
          {isSearchOpen ? (
              // ACTIVE SEARCH BAR
              <div className="flex-1 flex items-center bg-white/10 rounded-xl px-3 py-1 animate-in fade-in zoom-in-95 duration-200">
                  <Search size={18} className="text-gray-400 mr-2 shrink-0"/>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar raza, ubicación..."
                    className="bg-transparent border-none outline-none text-white w-full text-base placeholder-gray-400 h-9"
                  />
                  {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-white mr-1">
                          <X size={14} className="bg-gray-600 rounded-full p-0.5" />
                      </button>
                  )}
                  <button onClick={closeSearch} className="ml-2 text-sm font-bold text-gray-400 hover:text-white whitespace-nowrap">
                      Cancelar
                  </button>
              </div>
          ) : (
              // DEFAULT HEADER
              <>
                <h1 className="text-2xl font-extrabold tracking-tight animate-in fade-in slide-in-from-left-2">Mercado</h1>
                <div className="flex gap-2 animate-in fade-in slide-in-from-right-2 relative">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-white/10 relative text-gray-300 hover:text-white transition-colors"
                    >
                        <Search size={22} />
                    </button>
                    
                    {/* Filter Button */}
                    <button 
                        onClick={openFilterModal}
                        className={`p-2 rounded-full hover:bg-white/10 relative transition-colors ${activeFiltersCount > 0 ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
                    >
                        <SlidersHorizontal size={22} />
                        {activeFiltersCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
                        )}
                    </button>

                    {/* Inbox/Bell Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowInbox(!showInbox); }}
                        className={`p-2 rounded-full relative transition-colors ${showInbox ? 'bg-surface-dark text-white' : 'hover:bg-white/10 text-gray-300'}`}
                    >
                        <Bell size={22} />
                        {totalNotifications > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background-dark"></span>
                        )}
                    </button>

                    {/* --- INBOX DROPDOWN --- */}
                    {showInbox && (
                        <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-3 w-80 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-50"
                        >
                            {/* Tabs */}
                            <div className="flex border-b border-white/5 bg-surface-darker/50">
                                <button 
                                    onClick={() => setInboxTab('messages')}
                                    className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${inboxTab === 'messages' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                >
                                    Mensajes ({marketMessages.filter(m => m.unread).length})
                                </button>
                                <button 
                                    onClick={() => setInboxTab('notifications')}
                                    className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${inboxTab === 'notifications' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                >
                                    Alertas ({marketLikes.length})
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {inboxTab === 'messages' && (
                                    <div className="divide-y divide-white/5">
                                        {marketMessages.map(msg => (
                                            <div 
                                                key={msg.id} 
                                                onClick={() => navigate(`/chat/${msg.id}`)}
                                                className="p-3 hover:bg-white/5 cursor-pointer transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={msg.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                            <h4 className={`text-sm font-bold truncate ${msg.unread ? 'text-white' : 'text-gray-400'}`}>{msg.sender}</h4>
                                                            <span className="text-[10px] text-gray-500 whitespace-nowrap">{msg.time}</span>
                                                        </div>
                                                        <p className="text-xs text-primary font-medium truncate mb-0.5">{msg.item}</p>
                                                        <p className={`text-xs truncate ${msg.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>{msg.message}</p>
                                                    </div>
                                                    {msg.unread && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {inboxTab === 'notifications' && (
                                    <div className="divide-y divide-white/5">
                                        {marketLikes.map(like => (
                                            <div key={like.id} className="p-3 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3">
                                                <div className="relative">
                                                    <img src={like.avatar} className="w-10 h-10 rounded-full object-cover" />
                                                    <div className="absolute -bottom-1 -right-1 bg-red-500 p-0.5 rounded-full border border-surface-dark">
                                                        <Heart size={10} fill="currentColor" className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-300">
                                                        <span className="font-bold text-white">{like.user}</span> le interesó tu publicación <span className="font-bold text-white">{like.item}</span>.
                                                    </p>
                                                    <span className="text-[10px] text-gray-500 mt-1 block">{like.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-white/5 bg-surface-darker/30 text-center">
                                <button 
                                    onClick={() => navigate('/inbox')}
                                    className="text-xs text-primary font-bold hover:underline"
                                >
                                    Ver Todo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
              </>
          )}
        </div>

        {/* --- SEGMENTED CONTROL TABS --- */}
        {!isSearchOpen && (
            <div className="p-1 bg-surface-dark border border-white/10 rounded-xl flex gap-1 relative animate-in fade-in slide-in-from-top-1">
            <button 
                onClick={() => setActiveTab('MyPosts')}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center truncate ${
                    activeTab === 'MyPosts' 
                    ? 'bg-[#2a4533] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
            >
                Mis Publicaciones
            </button>
            <button 
                onClick={() => setActiveTab('Global')}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center truncate ${
                    activeTab === 'Global' 
                    ? 'bg-[#2a4533] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
            >
                En Venta Global
            </button>
            <button 
                onClick={() => setActiveTab('Favorites')}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center truncate ${
                    activeTab === 'Favorites' 
                    ? 'bg-[#2a4533] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
            >
                Favoritos
            </button>
            </div>
        )}
      </header>

      {/* --- LISTINGS GRID --- */}
      <main className="p-4 space-y-4">
        {displayedListings.length === 0 ? (
            <div className="text-center py-20 opacity-50 flex flex-col items-center">
                <Search size={48} className="mb-3 text-gray-600" />
                <p className="text-lg font-bold">No se encontraron resultados</p>
                <p className="text-sm text-gray-400">
                    {searchQuery ? `No hay coincidencias para "${searchQuery}"` : activeTab === 'Favorites' ? 'Agrega favoritos para verlos aquí.' : 'Intenta ajustar tus filtros.'}
                </p>
                {(activeTab === 'Global' && !searchQuery) && (
                    <button onClick={() => { clearTempFilters(); applyFilters(); }} className="mt-4 text-primary font-bold hover:underline">
                        Limpiar Filtros
                    </button>
                )}
                {searchQuery && (
                    <button onClick={closeSearch} className="mt-4 text-primary font-bold hover:underline">
                        Borrar Búsqueda
                    </button>
                )}
            </div>
        ) : (
            // Render logic based on Tab
            activeTab === 'MyPosts' ? (
                // --- MY POSTS CARD STYLE (Management) ---
                displayedListings.map((listing: any) => (
                    <article key={listing.id} className="bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-white/5 transition-transform active:scale-[0.99] duration-150">
                        <div className={`relative w-full aspect-[4/3] group ${listing.status === 'Sold' ? 'grayscale-[0.5]' : ''}`}>
                            <div className="w-full h-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${listing.imageUrl}")` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80"></div>
                            
                            {/* Status Badge */}
                            <div className={`absolute top-3 left-3 px-3 py-1 text-background-dark text-xs font-bold rounded-full shadow-lg flex items-center gap-1 ${
                                listing.status === 'Active' ? 'bg-primary' : 
                                listing.status === 'Sold' ? 'bg-accent-amber' : 'bg-slate-500 text-white'
                            }`}>
                                {listing.status === 'Active' && <CheckCircle2 size={14} />}
                                {listing.status === 'Sold' && <DollarSign size={14} />}
                                {listing.status === 'Inactive' && <Pause size={14} fill="currentColor" />}
                                <span>{listing.status === 'Active' ? 'ACTIVO' : listing.status === 'Sold' ? 'VENDIDO' : 'INACTIVO'}</span>
                            </div>
                            
                            <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                <MoreVertical size={20} />
                            </button>

                            <div className="absolute bottom-3 left-4 right-4">
                                <h3 className="text-lg font-bold text-white leading-tight mb-2">{listing.title}</h3>
                                
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                                        <Eye size={14} /> <span>342</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                                        <Heart size={14} fill="currentColor" /> <span>28</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                                        <MapPin size={16} />
                                        <span className="truncate">{listing.location}</span>
                                    </div>
                                    <span className={`text-xl font-extrabold tracking-tight ${listing.status === 'Sold' ? 'text-gray-300 line-through' : 'text-primary'}`}>
                                        {formatPrice(listing.price)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-black/20 border-t border-white/5 flex items-center justify-between gap-2">
                            {listing.status === 'Active' ? (
                                <>
                                    <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 hover:bg-white/5 text-gray-200 text-sm font-bold transition-colors">
                                        <Edit2 size={18} /> Editar
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-accent-amber/10 text-accent-amber border border-accent-amber/20 hover:bg-accent-amber/20 text-sm font-bold transition-colors">
                                        <Tag size={18} /> Vendido
                                    </button>
                                </>
                            ) : listing.status === 'Inactive' ? (
                                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-background-dark hover:bg-primary/90 shadow-sm text-sm font-bold transition-colors">
                                    <Play size={18} fill="currentColor" /> Reactivar
                                </button>
                            ) : (
                                <span className="text-xs text-gray-400 font-medium mr-auto pl-1">Finalizado el 12 Oct</span>
                            )}
                            
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-900/20 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </article>
                ))
            ) : (
                // --- GLOBAL / FAVORITES CARD STYLE (Browsing) ---
                displayedListings.map((listing) => (
                    <div 
                        key={listing.id} 
                        onClick={() => navigate(`/market/${listing.id}`)}
                        className="bg-surface-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer group shadow-lg"
                    >
                        {/* Image Area */}
                        <div className="relative h-64 w-full">
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        <div className="absolute top-3 right-3">
                            <button 
                                onClick={(e) => toggleFavorite(e, listing.id)}
                                className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                                    listing.isFavorite 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-black/30 text-white hover:bg-white/20'
                                }`}
                            >
                                <Heart size={16} fill={listing.isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white leading-tight mb-1 shadow-black/50 drop-shadow-md">{listing.title}</h3>
                                <div className="flex items-center gap-1 text-gray-300 text-xs">
                                <MapPin size={12} className="text-primary" />
                                {listing.location}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold text-primary drop-shadow-md">
                                    {formatPrice(listing.price)}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{listing.currency}</span>
                            </div>
                        </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-3">
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white/5 rounded-lg py-2 px-1 flex flex-col items-center justify-center border border-white/5">
                                <Calendar size={14} className="text-gray-400 mb-1" />
                                <span className="text-xs font-bold">{listing.stats.age}</span>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-lg py-2 px-1 flex flex-col items-center justify-center border border-white/5">
                                <Weight size={14} className="text-gray-400 mb-1" />
                                <span className="text-xs font-bold">{listing.stats.weight}</span>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-lg py-2 px-1 flex flex-col items-center justify-center border border-white/5">
                                <div className={`text-xs font-bold ${listing.stats.gender === 'Macho' ? 'text-blue-400' : 'text-pink-400'}`}>
                                {listing.stats.gender === 'Macho' ? '♂' : '♀'} {listing.stats.gender}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                ))
            )
        )}
      </main>
      
      {/* Sell Button */}
      {!isSearchOpen && (
        <button 
            onClick={() => navigate('/market/create')}
            className="fixed bottom-24 right-5 h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold pl-5 pr-6 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95 z-30"
        >
            <Plus size={24} />
            Vender
        </button>
      )}

      {/* --- FILTER MODAL (UPDATED - STICKY FOOTER) --- */}
      {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-surface-dark border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 shadow-2xl">
                  
                  {/* Modal Header - Fixed */}
                  <div className="flex justify-between items-center p-6 pb-2 shrink-0 border-b border-white/5">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                          <SlidersHorizontal size={20} className="text-primary"/> Filtros
                      </h2>
                      <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      
                      {/* Sort By */}
                      <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Ordenar Por</label>
                          <div className="flex bg-surface-darker p-1.5 rounded-xl border border-white/5">
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'recent'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'recent' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500'}`}
                              >
                                  Recientes
                              </button>
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'price_asc'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'price_asc' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500'}`}
                              >
                                  Precio Bajo
                              </button>
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'price_desc'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'price_desc' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500'}`}
                              >
                                  Precio Alto
                              </button>
                          </div>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Rango de Precio (COP)</label>
                          <div className="flex gap-4 items-center">
                              <div className="relative flex-1">
                                  <span className="absolute left-3 top-3 text-gray-500 text-xs">$</span>
                                  <input 
                                    type="number" 
                                    placeholder="Mín" 
                                    value={tempFilters.minPrice}
                                    onChange={(e) => setTempFilters({...tempFilters, minPrice: e.target.value})}
                                    className="w-full bg-surface-darker border border-white/10 rounded-xl py-2.5 pl-6 pr-2 text-sm text-white focus:border-primary outline-none"
                                  />
                              </div>
                              <span className="text-gray-500">-</span>
                              <div className="relative flex-1">
                                  <span className="absolute left-3 top-3 text-gray-500 text-xs">$</span>
                                  <input 
                                    type="number" 
                                    placeholder="Máx" 
                                    value={tempFilters.maxPrice}
                                    onChange={(e) => setTempFilters({...tempFilters, maxPrice: e.target.value})}
                                    className="w-full bg-surface-darker border border-white/10 rounded-xl py-2.5 pl-6 pr-2 text-sm text-white focus:border-primary outline-none"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Sexo</label>
                          <div className="grid grid-cols-3 gap-3">
                              {['All', 'Macho', 'Hembra'].map((g) => (
                                  <button
                                    key={g}
                                    onClick={() => setTempFilters({...tempFilters, gender: g as any})}
                                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                                        tempFilters.gender === g 
                                        ? 'bg-primary/20 border-primary text-primary shadow-sm' 
                                        : 'bg-surface-darker border-transparent text-gray-400 hover:bg-white/5'
                                    }`}
                                  >
                                      {g === 'All' ? 'Todos' : g}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Ubicación</label>
                          <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-3.5 text-gray-500" />
                              <input 
                                type="text" 
                                placeholder="Ciudad o Departamento" 
                                value={tempFilters.location}
                                onChange={(e) => setTempFilters({...tempFilters, location: e.target.value})}
                                className="w-full bg-surface-darker border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm text-white focus:border-primary outline-none"
                              />
                          </div>
                      </div>

                      {/* Breed (Simple Select) */}
                      <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Raza</label>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                              {['All', 'Brahman', 'Holstein', 'Angus', 'Gyr', 'Jersey'].map((b) => (
                                  <button
                                    key={b}
                                    onClick={() => setTempFilters({...tempFilters, breed: b})}
                                    className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${
                                        tempFilters.breed === b 
                                        ? 'bg-accent-amber text-black border-accent-amber' 
                                        : 'bg-surface-darker border-white/10 text-gray-400 hover:border-white/30'
                                    }`}
                                  >
                                      {b === 'All' ? 'Todas' : b}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Spacer to ensure content doesn't sit flush against button */}
                      <div className="h-4"></div>
                  </div>

                  {/* Actions Footer - Fixed at bottom */}
                  <div className="p-6 pt-4 border-t border-white/10 shrink-0 bg-surface-dark rounded-b-3xl">
                      <div className="flex gap-3">
                        <button 
                            onClick={clearTempFilters}
                            className="flex-1 py-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                        >
                            Limpiar
                        </button>
                        <button 
                            onClick={applyFilters}
                            className="flex-[2] py-4 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(17,212,33,0.3)] flex items-center justify-center gap-2 active:scale-95"
                        >
                            <CheckCircle2 size={20} />
                            Ver Resultados
                        </button>
                      </div>
                  </div>

              </div>
          </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Market;
