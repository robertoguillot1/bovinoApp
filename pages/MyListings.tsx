
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, CheckCircle2, MoreVertical, Eye, Heart, MapPin, 
  Edit2, Tag, Trash2, DollarSign, Pause, Play, Plus, Store, Calendar, Weight 
} from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { marketListings } from '../mockData';

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'MyPosts' | 'Global' | 'Favorites'>('MyPosts');
  
  // Favorites Logic
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
      // Load favorites from localStorage
      const savedFavs = JSON.parse(localStorage.getItem('bovine_favorites') || '[]');
      setFavorites(savedFavs);
  }, [activeTab]); // Reload when tab changes

  // Filter listings for "Favorites" tab
  const favoriteListings = marketListings.filter(l => favorites.includes(l.id));

  // Toggle favorite from this view (remove)
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      localStorage.setItem('bovine_favorites', JSON.stringify(newFavs));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(price).replace('COP', '').trim();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 flex flex-col pb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pt-12 pb-4 shadow-sm dark:shadow-none border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate('/market')}
                className="flex items-center justify-center h-10 w-10 -ml-2 rounded-full text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight">Mis Anuncios</h1>
          </div>
          <button className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-surface-dark text-slate-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
            <Bell size={24} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-dark"></span>
          </button>
        </div>

        {/* Custom Segmented Control */}
        <div className="p-1 bg-gray-200 dark:bg-surface-dark rounded-xl flex gap-1 relative border dark:border-white/5">
          <button 
            onClick={() => setActiveTab('MyPosts')}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center ${
                activeTab === 'MyPosts' 
                ? 'bg-white dark:bg-[#2a4533] shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
             Mis Publicaciones
          </button>
          <button 
            onClick={() => setActiveTab('Global')}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center ${
                activeTab === 'Global' 
                ? 'bg-white dark:bg-[#2a4533] shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
             En Venta Global
          </button>
          <button 
            onClick={() => setActiveTab('Favorites')}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 text-center ${
                activeTab === 'Favorites' 
                ? 'bg-white dark:bg-[#2a4533] shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
             Favoritos
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 pt-4">
        
        {/* --- TAB: MY POSTS (Original Prototype) --- */}
        {activeTab === 'MyPosts' && (
            <>
                {/* Card 1: ACTIVE */}
                <article className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 transition-transform active:scale-[0.99] duration-150">
                <div className="relative w-full aspect-[4/3] group">
                    <div className="w-full h-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop")' }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80"></div>
                    
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-background-dark text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>ACTIVO</span>
                    </div>
                    
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <MoreVertical size={20} />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight mb-2">Toro Brahman Rojo</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Eye size={14} />
                        <span>342</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Heart size={14} fill="currentColor" />
                        <span>28</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin size={16} />
                        <span className="truncate">La Dorada, Caldas</span>
                        </div>
                        <span className="text-primary text-xl font-extrabold tracking-tight">$12.5M</span>
                    </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 text-sm font-bold transition-colors">
                    <Edit2 size={18} />
                    Editar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-accent-amber/10 text-amber-600 dark:text-accent-amber border border-accent-amber/20 hover:bg-accent-amber/20 text-sm font-bold transition-colors">
                    <Tag size={18} />
                    Vendido
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={20} />
                    </button>
                </div>
                </article>

                {/* Card 2: SOLD */}
                <article className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 opacity-90">
                <div className="relative w-full aspect-[4/3] group grayscale-[0.5]">
                    <div className="w-full h-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2670&auto=format&fit=crop")' }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80"></div>
                    
                    <div className="absolute top-3 left-3 px-3 py-1 bg-accent-amber text-background-dark text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>VENDIDO</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight mb-2">Lote 10 Vacas Holstein</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Eye size={14} />
                        <span>1.2k</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Heart size={14} fill="currentColor" />
                        <span>156</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin size={16} />
                        <span className="truncate">San Pedro, Antioquia</span>
                        </div>
                        <span className="text-gray-300 line-through text-lg font-bold tracking-tight">$45.0M</span>
                    </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2">
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-medium mr-auto pl-1">Finalizado el 12 Oct</span>
                    <button className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-colors">
                    <Trash2 size={18} />
                    Eliminar
                    </button>
                </div>
                </article>

                {/* Card 3: INACTIVE */}
                <article className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 transition-transform active:scale-[0.99] duration-150">
                <div className="relative w-full aspect-[4/3] group">
                    <div className="w-full h-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071&auto=format&fit=crop")' }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80"></div>
                    
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Pause size={14} fill="currentColor" />
                    <span>INACTIVO</span>
                    </div>
                    
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <MoreVertical size={20} />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight mb-2">Caballo Cuarto de Milla</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Eye size={14} />
                        <span>85</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-gray-100 text-xs font-medium border border-white/10">
                        <Heart size={14} fill="currentColor" />
                        <span>4</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin size={16} />
                        <span className="truncate">Villavicencio, Meta</span>
                        </div>
                        <span className="text-primary text-xl font-extrabold tracking-tight">$18.0M</span>
                    </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-background-dark hover:bg-primary/90 shadow-[0_2px_10px_rgba(19,236,91,0.2)] text-sm font-bold transition-colors">
                    <Play size={18} fill="currentColor" />
                    Reactivar
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <Edit2 size={20} />
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={20} />
                    </button>
                </div>
                </article>
            </>
        )}

        {/* --- TAB: FAVORITES --- */}
        {activeTab === 'Favorites' && (
            <>
                {favoriteListings.length === 0 ? (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center">
                        <Heart size={48} className="mb-3 text-gray-600" />
                        <p className="text-lg font-bold">Sin Favoritos</p>
                        <p className="text-sm text-gray-400">Marca anuncios en el mercado para verlos aquí.</p>
                        <button onClick={() => navigate('/market')} className="mt-4 text-primary font-bold hover:underline">Ir al Mercado</button>
                    </div>
                ) : (
                    favoriteListings.map((listing) => (
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
                                className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors bg-red-500 text-white hover:bg-red-600"
                            >
                                <Heart size={16} fill="currentColor" />
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
                )}
            </>
        )}

      </main>

      {/* FAB */}
      <button 
        onClick={() => navigate('/market/create')}
        className="fixed bottom-24 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-6 shadow-[0_4px_20px_rgba(19,236,91,0.4)] transition-transform hover:scale-105 active:scale-95 group"
      >
        <Plus size={24} className="text-background-dark group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-base font-bold text-background-dark">Nuevo</span>
      </button>

      <BottomNav />
    </div>
  );
};

export default MyListings;
