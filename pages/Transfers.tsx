import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, DollarSign, User, Tag, ChevronDown, 
  ShieldCheck, Camera, Image, ArrowRight, Timer, Users, 
  RefreshCw, MapPin, Info, Search, CheckCircle2, Circle
} from 'lucide-react';

const Transfers: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // State
  const [scope, setScope] = useState<'Individual' | 'Lote'>('Individual');
  const [movementType, setMovementType] = useState<'Transferencia' | 'Venta'>('Venta');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const toggleSelection = (id: string) => {
    if (scope === 'Individual') {
      // If individual, clicking toggles solely that one (radio behavior essentially, but deselectable)
      // Or simply replace selection
      setSelectedIds([id]);
    } else {
      // Batch
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  // --- STEP 1: INITIAL SELECTION ---
  if (step === 1) {
    return (
      <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
        {/* Header Step 1 */}
        <header className="p-4 flex items-center relative justify-center border-b border-white/5">
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Iniciar Traslado</h1>
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
            <div className="space-y-3">
              {/* Sale Card */}
              <div 
                onClick={() => setMovementType('Venta')}
                className={`relative flex items-center p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${movementType === 'Venta' ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5 hover:border-white/20'}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1c2e20] border border-white/10 flex items-center justify-center mr-4 shrink-0 text-blue-400">
                  <RefreshCw size={20} />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-base text-white">Venta / Salida</h3>
                  <p className="text-xs text-gray-400">Facturación externa</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${movementType === 'Venta' ? 'border-[#11d421] bg-[#11d421]' : 'border-gray-600'}`}>
                   {movementType === 'Venta' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Transfer Card */}
              <div 
                onClick={() => setMovementType('Transferencia')}
                className={`relative flex items-center p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${movementType === 'Transferencia' ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5 hover:border-white/20'}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1c2e20] border border-white/10 flex items-center justify-center mr-4 shrink-0 text-purple-400">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-base text-white">Transferencia Inter-Finca</h3>
                  <p className="text-xs text-gray-400">Movimiento interno</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${movementType === 'Transferencia' ? 'border-[#11d421] bg-[#11d421]' : 'border-gray-600'}`}>
                   {movementType === 'Transferencia' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
              </div>
            </div>
          </section>

          {/* Info Box */}
          <div className="bg-[#18281a] rounded-2xl p-4 border border-white/5 flex gap-3">
            <div className="shrink-0 pt-0.5">
               <Info size={20} className="text-[#11d421]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-1">Información Importante</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Asegúrate de tener los permisos sanitarios vigentes antes de iniciar una transferencia inter-finca.
              </p>
            </div>
          </div>

        </main>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#102212]/95 backdrop-blur-md border-t border-white/5 z-20">
          <button 
            onClick={handleStep1Continue}
            className="w-full h-14 rounded-full bg-[#11d421] hover:bg-[#0ebf1d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-black font-bold text-lg"
          >
            Continuar
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: ANIMAL SELECTION ---
  if (step === 2) {
    return (
      <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
        {/* Header Step 2 */}
        <header className="p-4 pt-6 flex flex-col gap-4 border-b border-white/5 bg-[#102212]/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep(1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {scope === 'Lote' ? 'Armar Lote' : 'Selección Individual'}
              </span>
              <h1 className="text-lg font-bold">Seleccionar Bovinos</h1>
            </div>
            <div className="w-10"></div> {/* Spacer */}
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-gray-500">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por ID o nombre..." 
              className="w-full bg-[#18281a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[#11d421] outline-none"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-32 space-y-3">
          {scope === 'Lote' && (
            <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-sm text-gray-400">{availableAnimals.length} disponibles</span>
              <button 
                onClick={() => setSelectedIds(selectedIds.length === availableAnimals.length ? [] : availableAnimals.map(a => a.id))}
                className="text-[#11d421] text-sm font-bold"
              >
                {selectedIds.length === availableAnimals.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
              </button>
            </div>
          )}

          {availableAnimals.map((animal) => {
            const active = isSelected(animal.id);
            return (
              <div 
                key={animal.id}
                onClick={() => toggleSelection(animal.id)}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${active ? 'bg-[#1c2e20] border-[#11d421]' : 'bg-[#18281a] border-white/5'}`}
              >
                <img src={animal.img} alt={animal.tag} className="w-14 h-14 rounded-full object-cover bg-gray-700" />
                
                <div className="flex-1">
                  <h3 className="font-bold text-base text-white">{animal.tag}</h3>
                  <p className="text-xs text-gray-400">{animal.breed} • {animal.weight}kg</p>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${active ? 'text-[#11d421]' : 'text-gray-600'}`}>
                  {scope === 'Individual' 
                    ? (active ? <CheckCircle2 size={24} fill="#11d421" className="text-black" /> : <Circle size={24} />)
                    : (active ? <div className="w-6 h-6 bg-[#11d421] rounded-md flex items-center justify-center"><CheckCircle2 size={16} className="text-black" /></div> : <div className="w-6 h-6 border-2 border-gray-600 rounded-md"></div>)
                  }
                </div>
              </div>
            );
          })}
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#102212]/95 backdrop-blur-md border-t border-white/5 z-20">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-sm text-gray-400">Seleccionados:</span>
            <span className="text-lg font-bold text-white">{selectedIds.length} <span className="text-sm font-normal text-gray-500">animales</span></span>
          </div>
          <button 
            onClick={handleStep2Continue}
            disabled={selectedIds.length === 0}
            className="w-full h-14 rounded-full bg-[#11d421] hover:bg-[#0ebf1d] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-black font-bold text-lg"
          >
            Confirmar Selección
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: EXECUTION (Matches Provided HTML) ---
  const selectedCount = selectedIds.length;
  // Get first selected animal for display if individual
  const firstSelected = availableAnimals.find(a => a.id === selectedIds[0]);

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#102212] text-[#111812] dark:text-white font-display min-h-screen flex flex-col overflow-hidden selection:bg-[#11d421] selection:text-black">
      {/* Header */}
      <header className="flex-none bg-[#f6f8f6] dark:bg-[#102212] p-4 pb-2 z-10">
        <div className="flex items-center h-12 justify-between">
          <button 
            onClick={() => setStep(2)}
            className="text-[#111812] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center justify-end">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#556b56] dark:text-[#9db99f] text-base font-bold leading-normal tracking-[0.015em] shrink-0 active:text-[#11d421] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
        <h1 className="text-[#111812] dark:text-white tracking-tight text-[28px] font-bold leading-tight mt-2 px-1">
          Traslado Animal
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24">
        {/* Animal/Batch Card */}
        <div className="px-5 py-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1c2e20] p-4 shadow-sm border border-[#e5e7eb] dark:border-[#2a3c2e]">
            <div className="flex flex-col justify-center gap-1 flex-[2_2_0px]">
              <p className="text-[#556b56] dark:text-[#9db99f] text-xs font-bold uppercase tracking-wider">
                {scope === 'Lote' ? 'Lote Personalizado' : `ID: ${firstSelected?.tag}`}
              </p>
              <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">
                {scope === 'Lote' ? `${selectedCount} Animales` : firstSelected?.breed || 'Bovino'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-[#11d421]/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                  {scope === 'Lote' ? 'Peso Total: Calculando...' : `Peso: ${firstSelected?.weight}kg`}
                </span>
              </div>
            </div>
            <div 
              className="w-24 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-none" 
              style={{ backgroundImage: `url("${scope === 'Lote' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hKqSnGiphtEltwwaw0k--F-zm_nVECtHApFrMBZBHuET7PzUifMcLkgj4zfVTcwaU_9U7Q31cOgcgHPpad5QxOrJP2zEjND56hH5G_GmEKyfx_sXwRhWHiIJ_9JceRPbeOLHDs3v89A9kAWa9QlEqf2v6ahnaiTIAFaxNbZiC5zPUXqX4poGcKSf7gz5FyuZKXLhCgYbls-HTY7sFMD4BFqYv1V1XOs7q1dwAYdpx_ayAu0jUsoLC0f4fACNbbR9B9whHqAmw_4' : firstSelected?.img || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop'}")` }}
            >
            </div>
          </div>
        </div>

        {/* Movement Type Switcher */}
        <div className="px-5 pb-6">
          <p className="text-[#111812] dark:text-white text-sm font-medium leading-normal pb-2 pl-1">Tipo de Movimiento</p>
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#e0e2e0] dark:bg-[#28392a] p-1 relative">
            
            <label className="flex cursor-pointer h-full flex-1 items-center justify-center rounded-lg px-2 relative z-10 transition-all duration-200">
              <input 
                className="peer invisible w-0 h-0 absolute" 
                name="movement-type" 
                type="radio" 
                value="Transferencia"
                checked={movementType === 'Transferencia'}
                onChange={() => setMovementType('Transferencia')}
              />
              <span className="text-[#556b56] dark:text-[#9db99f] text-sm font-semibold leading-normal peer-checked:text-[#111812] dark:peer-checked:text-white truncate">
                Transferencia
              </span>
              <div className="absolute inset-0 bg-white dark:bg-[#111812] rounded-lg shadow-sm hidden peer-checked:block -z-10"></div>
            </label>

            <label className="flex cursor-pointer h-full flex-1 items-center justify-center rounded-lg px-2 relative z-10 transition-all duration-200">
              <input 
                className="peer invisible w-0 h-0 absolute" 
                name="movement-type" 
                type="radio" 
                value="Venta"
                checked={movementType === 'Venta'}
                onChange={() => setMovementType('Venta')}
              />
              <span className="text-[#556b56] dark:text-[#9db99f] text-sm font-semibold leading-normal peer-checked:text-[#111812] dark:peer-checked:text-white truncate">
                Venta / Salida
              </span>
              <div className="absolute inset-0 bg-white dark:bg-[#102212] rounded-lg shadow-sm hidden peer-checked:block -z-10"></div>
            </label>

          </div>
        </div>

        <form className="flex flex-col gap-6 px-5" onSubmit={(e) => e.preventDefault()}>
          <label className="flex flex-col w-full">
            <span className="text-[#111812] dark:text-white text-base font-semibold leading-normal pb-2">Fecha del Evento</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="text-[#556b56] dark:text-[#9db99f]" size={24} />
              </div>
              <input 
                className="w-full h-14 rounded-xl border border-[#ccc] dark:border-[#3b543d] bg-white dark:bg-[#1c2e20] text-[#111812] dark:text-white pl-12 pr-4 focus:ring-2 focus:ring-[#11d421] focus:border-[#11d421] outline-none transition-all placeholder:text-[#9db99f]" 
                type="date" 
                defaultValue="2023-10-27"
              />
            </div>
          </label>

          {movementType === 'Venta' && (
            <div className="flex flex-col gap-6 p-5 rounded-2xl bg-white dark:bg-[#1a251b] border border-[#e5e7eb] dark:border-[#2a3c2e] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[#FFB300] bg-[#FFB300]/20 p-1 rounded-full">
                   <DollarSign size={20} className="text-[#FFB300]" />
                </div>
                <h3 className="text-[#111812] dark:text-white text-lg font-bold">Detalles de la Venta</h3>
              </div>
              <label className="flex flex-col w-full">
                <span className="text-[#111812] dark:text-white text-sm font-medium leading-normal pb-2">Precio Total (USD)</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB300] font-bold text-xl">$</span>
                  <input 
                    className="w-full h-16 rounded-xl border border-[#FFB300]/50 bg-[#FFB300]/5 text-[#FFB300] dark:text-[#FFCA28] pl-10 pr-4 text-2xl font-bold focus:ring-2 focus:ring-[#FFB300] focus:border-[#FFB300] outline-none placeholder:text-[#FFB300]/40" 
                    inputMode="decimal" 
                    placeholder="0.00" 
                    type="number" 
                  />
                </div>
              </label>
              <label className="flex flex-col w-full">
                <span className="text-[#111812] dark:text-white text-sm font-medium leading-normal pb-2">Comprador</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="text-[#556b56] dark:text-[#9db99f]" size={24} />
                  </div>
                  <input 
                    className="w-full h-14 rounded-xl border border-[#ccc] dark:border-[#3b543d] bg-white dark:bg-[#1c2e20] text-[#111812] dark:text-white pl-12 pr-4 focus:ring-2 focus:ring-[#11d421] focus:border-[#11d421] outline-none placeholder:text-[#556b56] dark:placeholder:text-[#5c6e5d]" 
                    placeholder="Nombre o Empresa" 
                    type="text" 
                  />
                </div>
              </label>
              <label className="flex flex-col w-full">
                <span className="text-[#111812] dark:text-white text-sm font-medium leading-normal pb-2">Motivo de Salida</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                     <Tag className="text-[#556b56] dark:text-[#9db99f]" size={24} />
                  </div>
                  <select className="w-full h-14 rounded-xl border border-[#ccc] dark:border-[#3b543d] bg-white dark:bg-[#1c2e20] text-[#111812] dark:text-white pl-12 pr-10 appearance-none focus:ring-2 focus:ring-[#11d421] focus:border-[#11d421] outline-none">
                    <option className="text-gray-500" disabled selected>Seleccionar motivo...</option>
                    <option value="venta">Venta Comercial</option>
                    <option value="matadero">Matadero</option>
                    <option value="descarte">Descarte Genético</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <ChevronDown className="text-[#556b56] dark:text-[#9db99f]" size={24} />
                  </div>
                </div>
              </label>
            </div>
          )}

          {movementType === 'Transferencia' && (
             <div className="flex flex-col gap-6 p-5 rounded-2xl bg-white dark:bg-[#1a251b] border border-[#e5e7eb] dark:border-[#2a3c2e] animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="text-[#11d421] bg-[#11d421]/20 p-1 rounded-full">
                       <MapPin size={20} className="text-[#11d421]" />
                    </div>
                    <h3 className="text-[#111812] dark:text-white text-lg font-bold">Detalles de Transferencia</h3>
                 </div>
                 <label className="flex flex-col w-full">
                    <span className="text-[#111812] dark:text-white text-sm font-medium leading-normal pb-2">Finca de Destino</span>
                    <div className="relative">
                        <select className="w-full h-14 rounded-xl border border-[#ccc] dark:border-[#3b543d] bg-white dark:bg-[#1c2e20] text-[#111812] dark:text-white pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[#11d421] focus:border-[#11d421] outline-none">
                            <option>Seleccionar Finca...</option>
                            <option>Finca El Roble (Córdoba)</option>
                            <option>Hacienda La Esperanza (Antioquia)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown className="text-[#556b56] dark:text-[#9db99f]" size={24} />
                        </div>
                    </div>
                 </label>
             </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <label className="text-[#111812] dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
              <span>Adjuntar Guía de Movilización</span>
              <ShieldCheck className="text-[#FFB300]" size={20} fill="#FFB300" strokeWidth={0} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className="relative overflow-hidden group flex flex-col items-center justify-center h-32 rounded-2xl bg-[#fdf8e8] dark:bg-[#2e2610] border-2 border-dashed border-[#FFB300] hover:bg-[#FFB300]/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-center size-12 bg-[#FFB300]/20 rounded-full mb-2 group-hover:bg-[#FFB300] group-hover:text-black text-[#FFB300] transition-colors">
                   <Camera size={28} />
                </div>
                <span className="text-[#111812] dark:text-white font-bold text-sm">Tomar Foto</span>
              </button>
              <button 
                type="button"
                className="relative overflow-hidden group flex flex-col items-center justify-center h-32 rounded-2xl bg-white dark:bg-[#1c2e20] border-2 border-dashed border-[#e5e7eb] dark:border-[#3b543d] hover:border-[#11d421] hover:bg-[#11d421]/5 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-center size-12 bg-[#e5e7eb] dark:bg-[#2a3c2e] rounded-full mb-2 group-hover:bg-[#11d421]/20 group-hover:text-[#11d421] text-[#556b56] dark:text-[#9db99f] transition-colors">
                   <Image size={28} />
                </div>
                <span className="text-[#111812] dark:text-white font-bold text-sm">Galería</span>
              </button>
            </div>
            <p className="text-xs text-[#556b56] dark:text-[#9db99f] pl-1">
              Requerido para transportes inter-municipales.
            </p>
          </div>

          <label className="flex flex-col w-full">
            <span className="text-[#111812] dark:text-white text-base font-semibold leading-normal pb-2">Notas Adicionales</span>
            <textarea 
              className="w-full rounded-xl border border-[#ccc] dark:border-[#3b543d] bg-white dark:bg-[#1c2e20] text-[#111812] dark:text-white p-4 focus:ring-2 focus:ring-[#11d421] focus:border-[#11d421] outline-none placeholder:text-[#556b56] dark:placeholder:text-[#5c6e5d] resize-none" 
              placeholder="Escriba cualquier observación aquí..." 
              rows={3}
            ></textarea>
          </label>
          <div className="h-8"></div>
        </form>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#f6f8f6]/90 dark:bg-[#102212]/90 backdrop-blur-md border-t border-[#e5e7eb] dark:border-[#2a3c2e] z-20">
        <button className="w-full h-14 rounded-xl bg-[#11d421] hover:bg-[#0ebf1d] active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgba(17,212,33,0.39)] flex items-center justify-center gap-2 group">
          <span className="text-[#051c07] text-lg font-bold tracking-wide">Confirmar Traslado</span>
          <ArrowRight className="text-[#051c07] group-hover:translate-x-1 transition-transform" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Transfers;