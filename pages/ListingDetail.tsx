
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2, ShieldCheck, MessageCircle, Weight, Calendar, Dna, Info } from 'lucide-react';
import { marketListings } from '../mockData';

const ListingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const listing = marketListings.find(l => l.id === id);

  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
         <img src={listing.imageUrl} className="w-full h-full object-cover" alt={listing.title} />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark"></div>
         
         {/* Navbar Overlay */}
         <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Heart size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Share2 size={20} />
                </button>
            </div>
         </div>

         {/* Title Info */}
         <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2 mb-2">
                    {listing.verified && (
                        <span className="bg-accent-amber text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                            <ShieldCheck size={12} /> Verificado
                        </span>
                    )}
                    <span className="bg-surface-dark/80 backdrop-blur-sm border border-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        ID: #{listing.id}
                    </span>
                </div>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-2">{listing.title}</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                    <MapPin size={16} className="text-primary" />
                    {listing.location}
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase text-right">{listing.currency}</p>
                </div>
            </div>
         </div>
      </div>

      <main className="flex-1 p-5 pb-32 space-y-8">
         {/* Key Stats Grid */}
         <div className="grid grid-cols-4 gap-2">
            <div className="bg-surface-dark border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Weight size={20} className="text-primary mb-1" />
                <span className="text-[10px] text-gray-400 uppercase font-bold">Peso</span>
                <span className="text-sm font-bold">{listing.stats.weight}</span>
            </div>
            <div className="bg-surface-dark border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Calendar size={20} className="text-primary mb-1" />
                <span className="text-[10px] text-gray-400 uppercase font-bold">Edad</span>
                <span className="text-sm font-bold">{listing.stats.age}</span>
            </div>
            <div className="bg-surface-dark border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Dna size={20} className="text-primary mb-1" />
                <span className="text-[10px] text-gray-400 uppercase font-bold">Raza</span>
                <span className="text-xs font-bold truncate w-full">{listing.stats.breed}</span>
            </div>
             <div className="bg-surface-dark border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-lg mb-1">{listing.stats.gender === 'Macho' ? '♂' : '♀'}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Sexo</span>
                <span className="text-sm font-bold">{listing.stats.gender}</span>
            </div>
         </div>

         {/* Description */}
         <div>
            <h3 className="text-lg font-bold mb-2">Descripción</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
                {listing.description}
            </p>
         </div>

         {/* Technical Sheet */}
         <div>
            <h3 className="text-lg font-bold mb-3">Ficha Técnica</h3>
            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">
                <div className="flex justify-between p-4 border-b border-white/5">
                    <span className="text-sm text-gray-400">Raza</span>
                    <span className="text-sm font-bold text-white">{listing.stats.breed}</span>
                </div>
                <div className="flex justify-between p-4 border-b border-white/5">
                    <span className="text-sm text-gray-400">Propósito</span>
                    <span className="text-sm font-bold text-white">Carne / Cría</span>
                </div>
                <div className="flex justify-between p-4 border-b border-white/5">
                    <span className="text-sm text-gray-400">Vacunación</span>
                    <span className="text-sm font-bold text-green-400 flex items-center gap-1"><CheckCircle2 size={14}/> Completa</span>
                </div>
                <div className="flex justify-between p-4 border-b border-white/5">
                    <span className="text-sm text-gray-400">Registro</span>
                    <span className="text-sm font-bold text-white uppercase">ASOCEBU #88392</span>
                </div>
                <div className="flex justify-between p-4">
                     <span className="text-sm text-gray-400">Ubicación Actual</span>
                     <span className="text-sm font-bold text-white text-right">Finca El Roble,<br/>Lote Norte</span>
                </div>
            </div>
         </div>

         {/* Seller Profile */}
         <div className="bg-surface-dark rounded-xl p-4 border border-white/5 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                 {listing.sellerName.charAt(0)}
             </div>
             <div className="flex-1">
                 <h4 className="font-bold text-white">{listing.sellerName}</h4>
                 <div className="flex items-center gap-1">
                     {[1,2,3,4,5].map(s => <span key={s} className="text-accent-amber text-xs">★</span>)}
                     <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                 </div>
             </div>
             <button className="text-primary text-sm font-bold hover:underline">Ver Perfil</button>
         </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 w-full p-4 pb-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button className="w-full h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
            <MessageCircle size={22} />
            Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ListingDetail;
