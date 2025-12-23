
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Filter, Plus, Heart, MapPin, Calendar, Weight, CheckCircle2, SlidersHorizontal, X, DollarSign, ChevronDown, Store } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { marketListings } from '../mockData';

interface FilterState {
  sortBy: 'recent' | 'price_asc' | 'price_desc';
  minPrice: string;
  maxPrice: string;
  gender: 'All' | 'Macho' | 'Hembra';
  location: string;
  breed: string;
}

const Market: React.FC = () => {
  const navigate = useNavigate();
  
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
  const [showFavorites, setShowFavorites] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Applied Filters State (The ones currently affecting the list)
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recent',
    minPrice: '',
    maxPrice: '',
    gender: 'All',
    location: '',
    breed: 'All'
  });

  // Temporary Filters State (For the modal inputs)
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Sync favorites across tabs/windows if needed (optional, but good for UX)
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

  // Calculate active filters count for the badge based on APPLIED filters
  const activeFiltersCount = [
    filters.minPrice, 
    filters.maxPrice, 
    filters.location, 
    filters.gender !== 'All', 
    filters.breed !== 'All'
  ].filter(Boolean).length;

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
        // Persist to localStorage
        const favIds = updated.filter(i => i.isFavorite).map(i => i.id);
        localStorage.setItem('bovine_favorites', JSON.stringify(favIds));
        return updated;
    });
  };

  // --- FILTERING LOGIC (Uses `filters` state) ---
  const filteredListings = localListings.filter(listing => {
    // 1. Favorites Check
    if (showFavorites && !listing.isFavorite) return false;

    // 2. Price Range
    const price = listing.price;
    const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    if (price < min || price > max) return false;

    // 3. Gender
    if (filters.gender !== 'All' && listing.stats.gender !== filters.gender) return false;

    // 4. Location (Simple includes check)
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

    // 5. Breed (Simple includes check)
    if (filters.breed !== 'All' && !listing.stats.breed.includes(filters.breed)) return false;

    return true;
  }).sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      return 0; // Default (Recents)
  });

  // Modal Actions
  const openFilterModal = () => {
      setTempFilters({...filters}); // Sync temp with current applied
      setIsFilterOpen(true);
  };

  const applyFilters = () => {
      setFilters(tempFilters); // Commit changes
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

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col pb-20 relative">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-10 pb-3">
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-2xl font-extrabold">Marketplace</h1>
          <div className="flex gap-2">
            <button 
                onClick={() => navigate('/market/my-listings')}
                className="p-2 rounded-full hover:bg-white/10 relative text-gray-300 hover:text-white"
                title="Mis Anuncios"
            >
              <Store size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 relative">
              <Search size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* --- FIXED FAVORITES & FILTER BAR --- */}
        <div className="flex gap-3 px-4">
            {/* Fixed Favorite Toggle */}
            <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all border shrink-0 ${
                    showFavorites 
                    ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                    : 'bg-surface-dark text-gray-400 border-white/10 hover:text-white'
                }`}
            >
                <Heart size={20} fill={showFavorites ? "currentColor" : "none"} />
            </button>

            {/* Expandable Filter Button */}
            <button 
                onClick={openFilterModal}
                className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    activeFiltersCount > 0 
                    ? 'bg-primary text-background-dark border-primary' 
                    : 'bg-surface-dark text-gray-300 border-white/10 hover:bg-white/5'
                }`}
            >
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    <span>Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </div>
                <ChevronDown size={16} />
            </button>
        </div>
      </header>

      {/* --- LISTINGS GRID --- */}
      <main className="p-4 space-y-4">
        {filteredListings.length === 0 ? (
            <div className="text-center py-20 opacity-50 flex flex-col items-center">
                <Search size={48} className="mb-3 text-gray-600" />
                <p className="text-lg font-bold">No se encontraron resultados</p>
                <p className="text-sm text-gray-400">Intenta ajustar tus filtros.</p>
                <button onClick={() => { clearTempFilters(); applyFilters(); }} className="mt-4 text-primary font-bold hover:underline">
                    Limpiar Filtros
                </button>
            </div>
        ) : (
            filteredListings.map((listing) => (
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
        )}
      </main>
      
      {/* Sell Button */}
      <button 
        onClick={() => navigate('/market/create')}
        className="fixed bottom-24 right-5 h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold pl-5 pr-6 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95 z-30"
      >
        <Plus size={24} />
        Vender
      </button>

      {/* --- FILTER MODAL (BOTTOM SHEET) --- */}
      {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-surface-dark border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                          <SlidersHorizontal size={20} className="text-primary"/> Filtros
                      </h2>
                      <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="space-y-6">
                      
                      {/* Sort By */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Ordenar Por</label>
                          <div className="flex bg-surface-darker p-1 rounded-xl">
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'recent'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'recent' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                              >
                                  Recientes
                              </button>
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'price_asc'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'price_asc' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                              >
                                  Precio Bajo
                              </button>
                              <button 
                                onClick={() => setTempFilters({...tempFilters, sortBy: 'price_desc'})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tempFilters.sortBy === 'price_desc' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                              >
                                  Precio Alto
                              </button>
                          </div>
                      </div>

                      {/* Price Range */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Rango de Precio (COP)</label>
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
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Sexo</label>
                          <div className="grid grid-cols-3 gap-3">
                              {['All', 'Macho', 'Hembra'].map((g) => (
                                  <button
                                    key={g}
                                    onClick={() => setTempFilters({...tempFilters, gender: g as any})}
                                    className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                                        tempFilters.gender === g 
                                        ? 'bg-primary/20 border-primary text-primary' 
                                        : 'bg-surface-darker border-transparent text-gray-400 hover:bg-white/5'
                                    }`}
                                  >
                                      {g === 'All' ? 'Todos' : g}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Location */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Ubicación</label>
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
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Raza</label>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar">
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

                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                      <button 
                        onClick={clearTempFilters}
                        className="flex-1 py-3.5 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-colors"
                      >
                          Limpiar
                      </button>
                      <button 
                        onClick={applyFilters}
                        className="flex-[2] py-3.5 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                          <CheckCircle2 size={18} />
                          Aplicar Filtros
                      </button>
                  </div>

              </div>
          </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Market;
