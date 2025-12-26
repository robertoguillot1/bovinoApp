
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2, ShieldCheck, Weight, Calendar, Dna, Send, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { marketListings } from '../mockData';
import html2canvas from 'html2canvas';

const ListingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const listing = marketListings.find(l => l.id === id);
  
  // Refs & State
  const printRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('Hola. ¿Sigue disponible?');
  const [sent, setSent] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Initialize Favorite State
  useEffect(() => {
      const saved = localStorage.getItem('bovine_favorites');
      if (saved && id) {
          const favorites = JSON.parse(saved);
          setIsFavorite(favorites.includes(id));
      }
  }, [id]);

  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const handleSend = () => {
      setSent(true);
      setTimeout(() => {
          setMessage('');
          setSent(false);
          alert('Mensaje enviado al vendedor.');
      }, 1500);
  };

  const toggleFavorite = () => {
      if (!id) return;
      
      const saved = localStorage.getItem('bovine_favorites');
      let favorites = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
          favorites = favorites.filter((favId: string) => favId !== id);
      } else {
          favorites.push(id);
      }

      localStorage.setItem('bovine_favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new Event('storage'));
  };

  // --- SHARE TEXT LOGIC ---
  const executeShareText = async () => {
      const shareText = `Mira este anuncio en BovineGuard: ${listing.title} - ${formatPrice(listing.price)}`;
      const shareUrl = window.location.href;

      setShowShareModal(false);

      if (navigator.share) {
          try {
              if (shareUrl.startsWith('http')) {
                  await navigator.share({
                      title: listing.title,
                      text: shareText,
                      url: shareUrl
                  });
              } else {
                  await navigator.share({
                      title: listing.title,
                      text: shareText
                  });
              }
          } catch (err: any) {
              if (err.name !== 'AbortError') {
                  fallbackClipboard(shareText, shareUrl);
              }
          }
      } else {
          fallbackClipboard(shareText, shareUrl);
      }
  };

  // --- SHARE IMAGE LOGIC ---
  const executeShareImage = async () => {
      if (!printRef.current) return;
      setIsGeneratingImage(true);
      setShowShareModal(false);

      // Allow modal to close visually
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
          const canvas = await html2canvas(printRef.current, {
              useCORS: true,
              scale: 2,
              backgroundColor: '#102212',
              ignoreElements: (element) => element.classList.contains('no-print')
          });

          canvas.toBlob(async (blob) => {
              if (!blob) {
                  setIsGeneratingImage(false);
                  return;
              }

              const file = new File([blob], `BovineGuard_Market_${listing.id}.png`, { type: 'image/png' });

              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                  try {
                      await navigator.share({
                          files: [file],
                          title: listing.title,
                          text: `Mira este anuncio: ${listing.title}`
                      });
                  } catch (shareError) {
                      console.warn('Native file share failed', shareError);
                  }
              } else {
                  // Fallback: Download
                  const link = document.createElement('a');
                  link.download = `BovineGuard_Market_${listing.id}.png`;
                  link.href = canvas.toDataURL();
                  link.click();
                  alert('Imagen guardada en descargas.');
              }
              setIsGeneratingImage(false);
          }, 'image/png');

      } catch (error) {
          console.error("Screenshot error:", error);
          alert("Error al generar la imagen.");
          setIsGeneratingImage(false);
      }
  };

  const fallbackClipboard = async (text: string, url: string) => {
      try {
          await navigator.clipboard.writeText(`${text}\n${url}`);
          alert('Enlace copiado al portapapeles');
      } catch (err) {
          console.error('Clipboard failed', err);
      }
  };

  return (
    <div ref={printRef} className="min-h-screen bg-background-dark text-white font-display flex flex-col relative">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
         <img src={listing.imageUrl} className="w-full h-full object-cover" alt={listing.title} crossOrigin="anonymous" />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark"></div>
         
         {/* Navbar Overlay - Hidden in Print */}
         <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-10 no-print">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex gap-2">
                <button 
                    onClick={toggleFavorite}
                    className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/20 hover:bg-white/10 text-white'}`}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button 
                    onClick={() => setShowShareModal(true)}
                    className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                >
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

      <main className="flex-1 p-5 pb-36 space-y-8">
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

      {/* NEW MESSENGER STYLE FOOTER - Hidden in Print */}
      <div className="fixed bottom-0 w-full p-4 bg-[#18281a] border-t border-white/10 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] no-print">
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-blue-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                Envía un mensaje al vendedor
            </label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 bg-surface-darker border border-white/10 rounded-full px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                    onClick={handleSend}
                    disabled={!message || sent}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    {sent ? <CheckCircle2 size={20} /> : <Send size={20} fill="currentColor" className="ml-0.5" />}
                </button>
            </div>
        </div>
      </div>

      {/* --- SHARE MODAL --- */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 no-print">
            <div className="bg-[#18281a] w-full max-w-xs rounded-3xl border border-white/10 p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                    <X size={20}/>
                </button>
                
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Share2 size={20} />
                    <h3 className="font-bold text-lg text-white">Compartir Anuncio</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6">¿Cómo deseas compartir?</p>

                {/* Screenshot Button */}
                <button 
                    onClick={executeShareImage} 
                    className="w-full py-4 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                    <ImageIcon size={20} />
                    Compartir Imagen (Capture)
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase">O Texto</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button 
                    onClick={executeShareText} 
                    className="w-full py-3 bg-surface-dark border border-primary/50 text-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-primary/10"
                >
                    <Share2 size={18} />
                    Copiar / Enviar Enlace
                </button>
            </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGeneratingImage && (
          <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
              <Loader2 size={48} className="text-primary animate-spin mb-4" />
              <p className="text-white font-bold animate-pulse">Generando Imagen...</p>
          </div>
      )}

    </div>
  );
};

export default ListingDetail;
