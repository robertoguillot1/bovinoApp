
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, User, Tag, ChevronDown,
  ShieldCheck, Camera, Image, ArrowRight, Timer, Users,
  RefreshCw, MapPin, Info, Search, CheckCircle2, Circle,
  History, FileText, Plus, Filter, ArrowUpRight, ArrowRightLeft
} from 'lucide-react';

const Transfers: React.FC = () => {
  const navigate = useNavigate();
  // Step 0: History, 1: Scope, 2: Selection, 3: Confirmation
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  // State for Wizard
  const [scope, setScope] = useState<'Individual' | 'Lote'>('Individual');
  const [movementType, setMovementType] = useState<'Transferencia' | 'Venta'>('Venta');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Sale' | 'Transfer'>('All');

  // Form States
  const [price, setPrice] = useState('');

  // Mock Data for History
  const historyData = [
      { id: 'TR-1029', date: '25 Oct 2023', type: 'Sale', quantity: 5, detail: 'Comprador: Carnes S.A.', amount: '$ 12.5M', status: 'Completed' },
      { id: 'TR-1028', date: '20 Oct 2023', type: 'Transfer', quantity: 12, detail: 'A: Finca El Roble', status: 'Completed' },
      { id: 'TR-1027', date: '15 Oct 2023', type: 'Sale', quantity: 1, detail: 'Descarte: Matadero Municipal', amount: '$ 2.1M', status: 'Completed' },
      { id: 'TR-1026', date: '10 Sep 2023', type: 'Transfer', quantity: 45, detail: 'A: Lote Engorde 2', status: 'Completed' },
  ];

  // Mock Data for Selection
  const availableAnimals = [
    { id: '1', tag: '5783-2', breed: 'Holstein', weight: 450, img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop' },
    { id: '2', tag: '9901-A', breed: 'Brahman', weight: 520, img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2670&auto=format&fit=crop' },
    { id: '3', tag: '1102-C', breed: 'Angus', weight: 380, img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1770&auto=format&fit=crop' },
    { id: '4', tag: '2201-B', breed: 'Jersey', weight: 410, img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop' },
    { id: '5', tag: '3305-D', breed: 'Gyr', weight: 480, img: 'https://images.unsplash.com/photo-1516467508483-a72120615613?q=80&w=1780&auto=format&fit=crop' },
  ];

  const handleStep1Continue = () => {
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (selectedIds.length > 0) {
      setStep(3);
    }
  };

  const handleFinalConfirm = () => {
      // Logic to save transfer would go here
      setStep(0); // Return to history
      setSelectedIds([]);
      setPrice('');
  }

  const toggleSelection = (id: string) => {
    if (scope === 'Individual') {
      setSelectedIds([id]);
    } else {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric chars
    const rawValue = e.target.value.replace(/\D/g, '');

    if (!rawValue) {
      setPrice('');
      return;
    }

    // Format with dots (ES-CO locale usually uses dots for thousands)
    const formatted = new Intl.NumberFormat('es-CO').format(parseInt(rawValue));
    setPrice(formatted);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  // --- STEP 0: HISTORY VIEW (NEW) ---
  if (step === 0) {
      const filteredHistory = historyData.filter(item => {
          if (historyFilter === 'All') return true;
          return item.type === historyFilter;
      });

      return (
        <div className="bg-background-dark text-white font-display min-h-screen flex flex-col relative">
            <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold leading-none">Traslados</h1>
                        <p className="text-xs text-gray-400 mt-1">Historial de Movimientos</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400">
                    <Search size={24} />
                </button>
            </header>

            {/* Filter Tabs */}
            <div className="p-4 pb-2">
                <div className="flex bg-surface-dark p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setHistoryFilter('All')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyFilter === 'All' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setHistoryFilter('Sale')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyFilter === 'Sale' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Ventas
                    </button>
                    <button
                        onClick={() => setHistoryFilter('Transfer')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyFilter === 'Transfer' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Internos
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
                {filteredHistory.map((item) => (
                    <div key={item.id} className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors cursor-pointer active:scale-[0.99]">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    item.type === 'Sale'
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-blue-500/20 text-blue-500'
                                }`}>
                                    {item.type === 'Sale' ? <DollarSign size={20} /> : <ArrowRightLeft size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white text-base">
                                            {item.type === 'Sale' ? 'Venta de Ganado' : 'Traslado Interno'}
                                        </h3>
                                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">{item.id}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        <Calendar size={12} /> {item.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                    item.status === 'Completed'
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {item.status === 'Completed' ? 'Completado' : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-white/5 w-full"></div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-200">{item.detail}</p>
                                <p className="text-xs text-gray-500">{item.quantity} Animales involucrados</p>
                            </div>
                            {item.amount && (
                                <span className="text-lg font-bold text-white">{item.amount}</span>
                            )}
                        </div>
                    </div>
                ))}
            </main>

            {/* FAB to Start Wizard */}
            <button
                onClick={() => setStep(1)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-black rounded-full shadow-[0_0_20px_rgba(17,212,33,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
            >
                <Plus size={28} />
            </button>
        </div>
      );
  }

  // --- STEP 1: INITIAL SELECTION ---
  if (step === 1) {
    return (
      <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
        {/* Header Step 1 */}
        <header className="p-4 flex items-center relative justify-center border-b border-white/5">
          <button
            onClick={() => setStep(0)} // Go back to History
            className="absolute left-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Nuevo Movimiento</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-5 pb-32 space-y-8">

          {/* Section 1: Scope */}
          <section>
            <h2 className="text-2xl font-bold mb-1">¿Qué vas a trasladar?</h2>
            <p className="text-gray-400 text-sm mb-4">Selecciona el alcance del movimiento.</p>

            <div className="space-y-3">
              {/* Individual Card */}
              <div
                onClick={() => { setScope('Individual'); setSelectedIds([]); }}
                className={`relative flex items-center p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${scope === 'Individual' ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5 hover:border-white/20'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#2a3c2e] flex items-center justify-center mr-4 shrink-0 text-[#11d421]">
                  <Timer size={24} />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-base text-white">Traslado Individual</h3>
                  <p className="text-xs text-gray-400">Seleccionar un solo animal por ID</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scope === 'Individual' ? 'border-[#11d421] bg-[#11d421]' : 'border-gray-600'}`}>
                   {scope === 'Individual' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Batch Card */}
              <div
                onClick={() => { setScope('Lote'); setSelectedIds([]); }}
                className={`relative flex items-center p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${scope === 'Lote' ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5 hover:border-white/20'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#2a3c2e] flex items-center justify-center mr-4 shrink-0 text-[#ffc107]">
                  <Users size={24} />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-base text-white">Traslado por Lote</h3>
                  <p className="text-xs text-gray-400">Mover un grupo completo</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scope === 'Lote' ? 'border-[#11d421] bg-[#11d421]' : 'border-gray-600'}`}>
                   {scope === 'Lote' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Type */}
          <section>
            <h2 className="text-lg font-bold mb-4">Tipo de Movimiento</h2>
            <div className="grid grid-cols-2 gap-4">
               <button
                  onClick={() => setMovementType('Venta')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${movementType === 'Venta' ? 'bg-[#1c2e20] border-[#11d421] text-[#11d421]' : 'bg-[#18281a] border-white/5 text-gray-400'}`}
               >
                  <DollarSign size={28} />
                  <span className="font-bold">Venta</span>
               </button>
               <button
                  onClick={() => setMovementType('Transferencia')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${movementType === 'Transferencia' ? 'bg-[#1c2e20] border-[#11d421] text-[#11d421]' : 'bg-[#18281a] border-white/5 text-gray-400'}`}
               >
                  <RefreshCw size={28} />
                  <span className="font-bold">Interno</span>
               </button>
            </div>
          </section>

        </main>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleStep1Continue}
            className="w-full bg-[#11d421] hover:bg-[#0eb31c] text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            Continuar <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: SELECT ANIMALS ---
  if (step === 2) {
    return (
        <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => setStep(1)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-bold">Seleccionar Ganado</h1>
                    <p className="text-xs text-gray-400">{selectedIds.length} seleccionados</p>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-3">
                 {/* Search Bar */}
                 <div className="relative mb-2">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por ID..."
                        className="w-full bg-[#18281a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[#11d421] outline-none transition-all"
                    />
                </div>

                {availableAnimals.map(animal => {
                    const selected = isSelected(animal.id);
                    return (
                        <div
                            key={animal.id}
                            onClick={() => toggleSelection(animal.id)}
                            className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${selected ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5'}`}
                        >
                            <img src={animal.img} className="w-12 h-12 rounded-lg object-cover mr-4" />
                            <div className="flex-1">
                                <h3 className="font-bold text-white">{animal.tag}</h3>
                                <p className="text-xs text-gray-400">{animal.breed} • {animal.weight}kg</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'bg-[#11d421] border-[#11d421]' : 'border-gray-600'}`}>
                                {selected && <CheckCircle2 size={16} className="text-black" />}
                            </div>
                        </div>
                    )
                })}
            </main>

            <div className="p-6 border-t border-white/5">
                <button
                    onClick={handleStep2Continue}
                    disabled={selectedIds.length === 0}
                    className="w-full bg-[#11d421] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0eb31c] text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    Confirmar Selección <ArrowRight size={20} />
                </button>
            </div>
        </div>
    )
  }

  // --- STEP 3: CONFIRMATION & DETAILS ---
  if (step === 3) {
      return (
        <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => setStep(2)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Detalles del Movimiento</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-[#18281a] p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Tipo</p>
                        <p className="text-lg font-bold text-white">{movementType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold text-right">Cantidad</p>
                        <p className="text-lg font-bold text-white text-right">{selectedIds.length} Animales</p>
                    </div>
                </div>

                {movementType === 'Venta' && (
                    <div>
                         <label className="block text-sm font-bold text-gray-400 mb-2">Precio Total (Opcional)</label>
                         <div className="relative">
                            <div className="absolute left-4 top-4 text-gray-500"><DollarSign size={20} /></div>
                            <input
                                type="text"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="0"
                                className="w-full bg-[#18281a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[#11d421] outline-none transition-all text-xl font-bold"
                            />
                         </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">
                        {movementType === 'Venta' ? 'Comprador / Destino' : 'Ubicación de Destino'}
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><MapPin size={20} /></div>
                        <input
                            type="text"
                            placeholder={movementType === 'Venta' ? "Nombre del comprador..." : "Ej: Potrero 3"}
                            className="w-full bg-[#18281a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[#11d421] outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Observaciones</label>
                    <textarea
                        rows={3}
                        placeholder="Notas adicionales..."
                        className="w-full bg-[#18281a] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-[#11d421] outline-none transition-all resize-none"
                    />
                </div>
            </main>

            <div className="p-6 border-t border-white/5">
                <button
                    onClick={handleFinalConfirm}
                    className="w-full bg-[#11d421] hover:bg-[#0eb31c] text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(17,212,33,0.3)]"
                >
                    <CheckCircle2 size={24} /> Confirmar {movementType}
                </button>
            </div>
        </div>
      );
  }

  return null;
};

export default Transfers;
