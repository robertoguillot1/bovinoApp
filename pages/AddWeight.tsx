import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Scale, Calendar, Save, ArrowLeft as BackSpace } from 'lucide-react';

const AddWeight: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to update weight history
    setTimeout(() => {
      setLoading(false);
      navigate(-1); // Go back to detail
    }, 1500);
  };

  const handleNumpad = (val: string) => {
    if (val === 'DEL') {
      setWeight(prev => prev.slice(0, -1));
    } else if (val === '.') {
      if (!weight.includes('.')) setWeight(prev => prev + val);
    } else {
      if (weight.length < 5) setWeight(prev => prev + val);
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
                <h1 className="text-xl font-bold leading-none">Registrar Peso</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {id || '5783-2'}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 pb-32">
        
        {/* Digital Scale Display */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
            <div className="relative w-full max-w-xs aspect-square bg-surface-dark rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(255,179,0,0.05)] flex flex-col items-center justify-center mb-6 group">
                <div className="absolute inset-2 rounded-full border border-dashed border-white/10 group-hover:border-accent-amber/30 transition-colors"></div>
                
                <Scale size={40} className="text-accent-amber mb-2 transition-transform group-hover:scale-110" />
                <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-mono font-bold tracking-tighter ${weight ? 'text-white' : 'text-gray-600'}`}>
                        {weight || '0'}
                    </span>
                    <span className="text-xl text-gray-400 font-bold">kg</span>
                </div>
                <span className="text-xs text-accent-amber font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-accent-amber/10 rounded-full border border-accent-amber/20">
                    Control de Peso
                </span>
            </div>

            {/* Date Input */}
            <div className="w-full max-w-sm bg-surface-dark p-2 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-darker flex items-center justify-center text-gray-400">
                    <Calendar size={20} />
                </div>
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-transparent text-white font-bold outline-none"
                />
            </div>
        </div>

        {/* Custom Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumpad(num.toString())}
                    className="h-16 rounded-2xl bg-surface-dark border border-white/5 text-2xl font-bold hover:bg-white/10 hover:border-accent-amber/50 transition-all active:scale-95"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => handleNumpad('DEL')}
                className="h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all active:scale-95"
            >
                <BackSpace size={24} />
            </button>
        </div>

      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading || !weight}
          className="w-full h-14 bg-accent-amber hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-accent-amber/20"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Save size={20} />
              Actualizar Peso
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddWeight;