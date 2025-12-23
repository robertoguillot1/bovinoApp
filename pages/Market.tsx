
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Filter, Plus, Heart, MapPin, Calendar, Weight, CheckCircle2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { marketListings } from '../mockData';

const Market: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Recientes');

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
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold">Marketplace</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-white/10 relative">
              <Search size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Más Recientes', 'Precio: Menor a Mayor', 'Cercanos', 'Genética'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                 filter === f 
                 ? 'bg-primary text-background-dark border-primary' 
                 : 'bg-surface-dark border-white/10 text-gray-400 hover:text-white'
               }`}
             >
               {f === 'Más Recientes' && <Filter size={12} className="inline mr-1" />}
               {f}
             </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {marketListings.map((listing) => (
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
                 <button className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors">
                    <Heart size={16} />
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
        ))}
      </main>
      
      {/* Sell Button */}
      <button 
        onClick={() => navigate('/market/create')}
        className="fixed bottom-24 right-5 h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold pl-5 pr-6 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
        Vender
      </button>

      <BottomNav />
    </div>
  );
};

export default Market;
