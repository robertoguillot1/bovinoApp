import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Droplets, Calendar, Clock, Save, Scale, AlertCircle } from 'lucide-react';

const AddProduction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [shift, setShift] = useState<'AM' | 'PM'>('AM');
  const [quality, setQuality] = useState<'Standard' | 'Premium' | 'Rejected'>('Standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to update chart data
    setTimeout(() => {
      setLoading(false);
      navigate(-1); // Go back to detail
    }, 1500);
  };

  const handleNumpad = (val: string) => {
    if (val === 'DEL') {
      setAmount(prev => prev.slice(0, -1));
    } else if (val === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + val);
    } else {
      if (amount.length < 5) setAmount(prev => prev + val);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold leading-none">Registrar Ordeño</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {id || '5783-2'}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 pb-32">
        
        {/* Digital Scale Display */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
            <div className="relative w-full max-w-xs aspect-square bg-surface-dark rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(17,212,33,0.05)] flex flex-col items-center justify-center mb-6 group">
                <div className="absolute inset-2 rounded-full border border-dashed border-white/10 group-hover:border-primary/30 transition-colors"></div>
                
                <Droplets size={32} className="text-primary mb-2 animate-bounce" />
                <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-mono font-bold tracking-tighter ${amount ? 'text-white' : 'text-gray-600'}`}>
                        {amount || '0.0'}
                    </span>
                    <span className="text-xl text-gray-400 font-bold">L</span>
                </div>
                <span className="text-xs text-primary font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    Producción
                </span>
            </div>

            {/* Shift & Date Toggle */}
            <div className="flex gap-4 w-full max-w-sm">
                <div className="flex-1 bg-surface-dark p-1 rounded-xl border border-white/10 flex">
                    <button 
                        onClick={() => setShift('AM')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${shift === 'AM' ? 'bg-accent-amber text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <span className="text-xs">🌅</span> AM
                    </button>
                    <button 
                        onClick={() => setShift('PM')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${shift === 'PM' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <span className="text-xs">🌇</span> PM
                    </button>
                </div>
                <div className="w-16 bg-surface-dark rounded-xl border border-white/10 flex items-center justify-center text-gray-300">
                    <Calendar size={24} />
                </div>
            </div>
        </div>

        {/* Custom Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumpad(num.toString())}
                    className="h-16 rounded-2xl bg-surface-dark border border-white/5 text-2xl font-bold hover:bg-white/10 hover:border-primary/50 transition-all active:scale-95"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => handleNumpad('DEL')}
                className="h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all active:scale-95"
            >
                <ArrowLeft size={24} />
            </button>
        </div>

      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Save size={20} />
              Registrar Litros
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProduction;