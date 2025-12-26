
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CalendarDays, ChevronDown, 
  FlaskConical, Sparkles, Users, User, Save, Cookie
} from 'lucide-react';

const RegisterCheese: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cheeseType, setCheeseType] = useState('Queso Costeño');
  const [milkAmount, setMilkAmount] = useState<string>('');
  const [cheeseAmount, setCheeseAmount] = useState<string>('');
  const [yieldPercent, setYieldPercent] = useState<string>('--');
  const [operator, setOperator] = useState('Carlos Martinez');
  const [notes, setNotes] = useState('');

  // Auto-calculate Yield
  useEffect(() => {
    const milk = parseFloat(milkAmount);
    const cheese = parseFloat(cheeseAmount);
    
    if (milk > 0 && cheese > 0) {
      const result = (cheese / milk) * 100;
      setYieldPercent(result.toFixed(2));
    } else {
      setYieldPercent('--');
    }
  }, [milkAmount, cheeseAmount]);

  const handleSubmit = () => {
    if (!milkAmount || !cheeseAmount) return;
    
    setLoading(true);
    
    const yieldVal = parseFloat(yieldPercent);
    const score = yieldVal > 12 ? 3 : yieldVal > 10 ? 2 : 1;
    const badgeText = score === 3 ? 'Rendimiento Alto' : score === 2 ? 'Estándar' : 'Bajo';
    const badgeColor = score === 3 ? 'text-[#13ec5b] bg-[#13ec5b]/10' : score === 2 ? 'text-gray-400 bg-gray-700/50' : 'text-red-400 bg-red-900/20';

    const newBatch = {
        id: Date.now().toString(),
        name: cheeseType,
        isoDate: date,
        date: new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        code: `#L-${Math.floor(Math.random() * 9000) + 1000}`,
        weight: parseFloat(cheeseAmount),
        badge: badgeText,
        badgeColor: badgeColor,
        milk: `${milkAmount} Litros`,
        yieldDisplay: `${yieldPercent}%`,
        yieldScore: score,
        operator: operator.split(' ')[0] + ' ' + (operator.split(' ')[1]?.[0] || '') + '.',
        status: 'En Cava',
        iconType: cheeseType.includes('Mozzarella') ? 'Utensils' : 'Leaf',
        details: true
    };

    // Persist to LocalStorage
    const existing = JSON.parse(localStorage.getItem('cheese_production_batches') || '[]');
    localStorage.setItem('cheese_production_batches', JSON.stringify([newBatch, ...existing]));

    setTimeout(() => {
      setLoading(false);
      navigate('/add-cheese'); 
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#102216] font-display text-white selection:bg-[#13ec5b] selection:text-[#111813] flex flex-col relative">
      
      {/* Header */}
      <header className="flex flex-none items-center justify-between p-4 pt-6 bg-[#102216] z-10">
        <button 
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1 text-center">Registrar Lote</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 pb-32 space-y-4">
        <p className="text-sm text-gray-500 mb-2 px-1">Complete los detalles para registrar un nuevo lote de producción.</p>

        {/* Section 1: Basic Info */}
        <details className="group rounded-2xl bg-[#28392e] border border-[#3b5443] overflow-hidden transition-all duration-300 open:shadow-xl open:ring-1 open:ring-[#13ec5b]/30" open>
            <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#28392e] hover:bg-white/5 transition-colors select-none">
                <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#13ec5b]/20 text-[#13ec5b]">
                        <CalendarDays size={18} />
                    </span>
                    <span className="font-bold text-white text-base">Información Básica</span>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-[#13ec5b]" />
            </summary>
            
            <div className="border-t border-[#3b5443] bg-black/20 p-5 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha de Producción</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarDays size={18} className="text-gray-400" />
                        </div>
                        <input 
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 pl-10 pr-3 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all shadow-sm [color-scheme:dark]" 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Queso</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Cookie size={18} className="text-gray-400" />
                        </div>
                        <select 
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 pl-10 pr-10 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none appearance-none transition-all shadow-sm"
                            value={cheeseType}
                            onChange={(e) => setCheeseType(e.target.value)}
                        >
                            <option>Queso Costeño</option>
                            <option>Queso Mozzarella</option>
                            <option>Queso Campesino</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </details>

        {/* Section 2: Inputs & Production */}
        <details className="group rounded-2xl bg-[#28392e] border border-[#3b5443] overflow-hidden transition-all duration-300 open:shadow-xl open:ring-1 open:ring-[#13ec5b]/30" open>
            <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#28392e] hover:bg-white/5 transition-colors select-none">
                <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#FFB800]/20 text-[#FFB800]">
                        <FlaskConical size={18} />
                    </span>
                    <span className="font-bold text-white text-base">Insumos y Producción</span>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-[#13ec5b]" />
            </summary>
            
            <div className="border-t border-[#3b5443] bg-black/20 p-5 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leche (Litros)</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 px-3 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all text-right font-mono text-lg placeholder-gray-600" 
                                placeholder="0" 
                                type="number"
                                value={milkAmount}
                                onChange={(e) => setMilkAmount(e.target.value)}
                            />
                            <span className="absolute left-3 top-3.5 text-gray-500 text-xs">Lts</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Queso (Kg)</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 px-3 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all text-right font-mono text-lg placeholder-gray-600" 
                                placeholder="0" 
                                type="number"
                                value={cheeseAmount}
                                onChange={(e) => setCheeseAmount(e.target.value)}
                            />
                            <span className="absolute left-3 top-3.5 text-gray-500 text-xs">Kg</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 pt-2">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-[#13ec5b] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={14} />
                            Rendimiento Estimado
                        </label>
                        <span className="text-[10px] text-gray-500">Calculado automáticamente</span>
                    </div>
                    <div className="w-full bg-[#1a3824] border border-[#13ec5b]/30 rounded-xl p-4 flex items-center justify-between shadow-inner">
                        <span className="text-gray-300 text-sm">Rendimiento actual:</span>
                        <span className="text-2xl font-bold text-[#13ec5b]">{yieldPercent} %</span>
                    </div>
                </div>
            </div>
        </details>

        {/* Section 3: Staff & Notes */}
        <details className="group rounded-2xl bg-[#28392e] border border-[#3b5443] overflow-hidden transition-all duration-300 open:shadow-xl open:ring-1 open:ring-[#13ec5b]/30">
            <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#28392e] hover:bg-white/5 transition-colors select-none">
                <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
                        <Users size={18} />
                    </span>
                    <span className="font-bold text-white text-base">Personal y Notas</span>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-[#13ec5b]" />
            </summary>
            
            <div className="border-t border-[#3b5443] bg-black/20 p-5 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operario Responsable</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <select 
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 pl-10 pr-10 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none appearance-none transition-all shadow-sm"
                            value={operator}
                            onChange={(e) => setOperator(e.target.value)}
                        >
                            <option value="" disabled>Seleccionar operario...</option>
                            <option>Carlos Martinez</option>
                            <option>Juan Pérez</option>
                            <option>Ana García</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Observaciones del Lote</label>
                    <textarea 
                        className="w-full bg-[#102216] border border-[#3b5443] rounded-xl py-3 px-3 text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all resize-none shadow-sm placeholder-gray-600" 
                        placeholder="Añade notas sobre calidad, incidentes, etc..." 
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </details>

      </main>

      {/* Footer Action */}
      <div className="absolute bottom-6 right-6 z-30">
        <button 
            onClick={handleSubmit}
            disabled={loading || !milkAmount || !cheeseAmount}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-[#13ec5b] px-6 py-4 text-[#111813] shadow-[0_0_20px_rgba(19,236,91,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(19,236,91,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <span className="font-bold text-base tracking-wide animate-pulse">Guardando...</span>
            ) : (
                <>
                    <Save size={24} className="font-bold" />
                    <span className="text-base font-bold tracking-wide">Guardar Lote</span>
                </>
            )}
        </button>
      </div>

    </div>
  );
};

export default RegisterCheese;
