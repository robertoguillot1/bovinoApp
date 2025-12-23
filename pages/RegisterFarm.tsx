import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Warehouse, Ruler, Sprout, Camera, Check, Crosshair, X, Navigation } from 'lucide-react';

const RegisterFarm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [location, setLocation] = useState('');
  
  // Map Modal State
  const [showMap, setShowMap] = useState(false);
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 }); // Percentage
  const mapRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPinPosition({ x, y });
    }
  };

  const confirmLocation = () => {
      // Simulate generic coordinates based on click
      const lat = (6 + (pinPosition.y / 100)).toFixed(6);
      const lng = (-75 - (pinPosition.x / 100)).toFixed(6);
      setLocation(`${lat}, ${lng} (Ubicación Satelital)`);
      setShowMap(false);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col relative">
      <header className="p-4 pt-8 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Registrar Nueva Finca</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Placeholder */}
          <div className="flex flex-col items-center justify-center gap-3 py-6 border-2 border-dashed border-white/20 rounded-2xl bg-surface-dark cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
            <div className="w-16 h-16 rounded-full bg-surface-darker flex items-center justify-center text-primary">
                <Camera size={32} />
            </div>
            <span className="text-sm font-medium text-gray-400">Subir Foto de Portada</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Nombre de la Finca</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Warehouse size={20} /></div>
                <input 
                  type="text" 
                  placeholder="ej. Hacienda La Fortuna" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Ubicación con Mapa (Updated UI) */}
            <div>
              <label className="block text-sm font-bold text-accent-amber mb-2 ml-1">Ubicación</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                    {/* Placeholder Text or Value */}
                    <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Dirección o Coordenadas" 
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber outline-none transition-all"
                        required
                    />
                </div>
                {/* Map Button */}
                <button 
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="aspect-square h-[58px] rounded-xl border border-accent-amber/50 bg-surface-darker flex items-center justify-center text-accent-amber hover:bg-accent-amber/10 active:scale-95 transition-all shadow-lg shadow-accent-amber/5"
                >
                    <Crosshair size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Tamaño (Ha)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><Ruler size={20} /></div>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Cabezas Iniciales</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><Sprout size={20} /></div>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Sistema de Producción</label>
              <div className="grid grid-cols-3 gap-2">
                {['Leche', 'Carne', 'Doble Propósito'].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input type="radio" name="system" className="peer sr-only" />
                    <div className="text-center py-3 rounded-xl bg-surface-dark border border-white/10 text-sm font-bold text-gray-400 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border-primary transition-all">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Creando Finca...</span>
          ) : (
            <>
              <Check size={20} />
              Crear Finca
            </>
          )}
        </button>
      </div>

      {/* --- MAP MODAL --- */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background-dark animate-in fade-in slide-in-from-bottom-10">
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between bg-surface-dark border-b border-white/10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowMap(false)} className="p-2 bg-white/5 rounded-full text-white">
                        <X size={20} />
                    </button>
                    <div>
                        <h3 className="font-bold text-lg">Definir Ubicación</h3>
                        <p className="text-xs text-gray-400">Toca el mapa para colocar el pin</p>
                    </div>
                </div>
                <button 
                    onClick={confirmLocation}
                    className="px-4 py-2 bg-accent-amber text-black font-bold rounded-lg text-sm flex items-center gap-2"
                >
                    <Check size={16} /> Confirmar
                </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-[#0f172a] overflow-hidden" ref={mapRef} onClick={handleMapClick}>
                {/* Satellite Map Background (Mock) */}
                <img 
                    src="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/-75.56,6.24,13,0/800x600?access_token=pk.mock" 
                    onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"} // Fallback to a landscape image if satellite fails
                    className="w-full h-full object-cover opacity-60"
                    alt="Satellite Map"
                />
                
                {/* Grid Overlay for tech feel */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                
                {/* The Pin */}
                <div 
                    className="absolute -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out drop-shadow-2xl"
                    style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                >
                    <div className="relative">
                        <MapPin size={48} className="text-accent-amber fill-accent-amber/20" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/50 blur-sm rounded-full"></div>
                    </div>
                </div>

                {/* Floating GPS Button */}
                <button className="absolute bottom-6 right-6 p-4 bg-surface-dark border border-white/10 rounded-full text-primary shadow-lg active:scale-95">
                    <Navigation size={24} />
                </button>
            </div>
            
            {/* Coordinate Display */}
            <div className="bg-surface-dark p-4 border-t border-white/10">
                 <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                     <span>LAT: {(6 + (pinPosition.y / 100)).toFixed(6)}</span>
                     <span>LNG: {(-75 - (pinPosition.x / 100)).toFixed(6)}</span>
                 </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default RegisterFarm;