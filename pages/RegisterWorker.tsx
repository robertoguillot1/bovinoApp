import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, DollarSign, Calendar, Camera, Check, Briefcase } from 'lucide-react';

const RegisterWorker: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/hr');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Nuevo Trabajador</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Placeholder */}
          <div className="flex flex-col items-center justify-center gap-3 py-6 border-2 border-dashed border-white/20 rounded-2xl bg-surface-dark cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group">
            <div className="w-16 h-16 rounded-full bg-surface-darker flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera size={32} />
            </div>
            <span className="text-sm font-medium text-gray-400">Subir Foto de Perfil</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><User size={20} /></div>
                <input 
                  type="text" 
                  placeholder="ej. Pedro Rodriguez" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Rol / Cargo</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Briefcase size={20} /></div>
                <input 
                  type="text" 
                  placeholder="ej. Mayordomo, Vaquero, Contratista..." 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Teléfono de Contacto</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Phone size={20} /></div>
                <input 
                  type="tel" 
                  placeholder="+57 300 123 4567" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Salario Base Mensual (COP)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><DollarSign size={20} /></div>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
               </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha de Ingreso</label>
                <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                <input 
                    type="date" 
                    className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
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
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Check size={20} />
              Registrar Trabajador
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterWorker;