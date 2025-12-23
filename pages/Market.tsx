import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, ShoppingBag, Truck, BadgeDollarSign, Hammer } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

const Market: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-b-[100%] blur-3xl pointer-events-none"></div>

      <header className="p-4 pt-8 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
            <Store className="text-primary" /> Mercado Ganadero
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 pb-32">
        
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative bg-surface-dark p-8 rounded-full border-2 border-primary/30 shadow-2xl">
                <Store size={64} className="text-primary" />
            </div>
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-4 bg-surface-dark p-2 rounded-full border border-white/10 animate-bounce delay-100">
                <BadgeDollarSign size={24} className="text-accent-amber" />
            </div>
            <div className="absolute -bottom-2 -left-4 bg-surface-dark p-2 rounded-full border border-white/10 animate-bounce delay-700">
                <Truck size={24} className="text-blue-400" />
            </div>
        </div>

        <div className="space-y-4 max-w-sm">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">
                Próximamente
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
                Estamos construyendo el primer marketplace digital integrado para la compra y venta de ganado certificado directamente desde tu finca.
            </p>
        </div>

        {/* Feature Preview List */}
        <div className="grid grid-cols-1 w-full gap-4 max-w-sm">
            <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center gap-4 text-left">
                <div className="bg-accent-amber/10 p-2 rounded-lg text-accent-amber">
                    <Hammer size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-white">Subastas en Vivo</h3>
                    <p className="text-xs text-gray-500">Puja en tiempo real por lotes premium.</p>
                </div>
            </div>
            <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center gap-4 text-left">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                    <ShoppingBag size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-white">Insumos Agrícolas</h3>
                    <p className="text-xs text-gray-500">Compra alimento y medicinas con descuento.</p>
                </div>
            </div>
        </div>

        <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
            Notificarme cuando esté listo
        </button>

      </main>

      <BottomNav />
    </div>
  );
};

export default Market;