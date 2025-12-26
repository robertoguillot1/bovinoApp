
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Scale, TrendingUp, PieChart, CheckCircle2, 
  Calendar, Leaf, Droplets, Percent, User, BadgeCheck, Utensils, 
  LayoutGrid, Cookie, Store, Plus, ChevronDown, History, ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AddCheese: React.FC = () => {
  const navigate = useNavigate();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  // --- CALENDAR STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- MAIN LIST FILTER STATE ---
  const [activeFilter, setActiveFilter] = useState<'None' | 'Yield' | 'Type'>('None');

  // --- HISTORY VIEW STATE ---
  const [showHistory, setShowHistory] = useState(false);
  const [historyPeriod, setHistoryPeriod] = useState<'7d' | '15d' | '30d'>('15d');
  const [historyCheeseType, setHistoryCheeseType] = useState('Todos');

  // Generate a rolling window of dates centered on selected date
  const daysStrip = useMemo(() => {
      const start = new Date(selectedDate);
      start.setDate(selectedDate.getDate() - 2); // Start 2 days before
      
      return Array.from({ length: 30 }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d;
      });
  }, [selectedDate]);

  // --- DATA STATE (From LocalStorage or Default Mock) ---
  const [allBatches, setAllBatches] = useState<any[]>(() => {
      const saved = localStorage.getItem('cheese_production_batches');
      if (saved) return JSON.parse(saved);
      
      // Default Mock Data seeded relative to Today for demo purposes
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      
      return [
        {
            id: 'lot1',
            name: 'Queso Costeño',
            isoDate: today.toISOString().split('T')[0],
            date: today.toLocaleDateString('es-ES', {day: 'numeric', month: 'short'}),
            code: '#QC-001',
            weight: 1250, // High number for the static card match initially
            badge: 'Rendimiento Alto',
            badgeColor: 'text-[#13ec5b] bg-[#13ec5b]/10',
            milk: '12000 Litros',
            yieldDisplay: '10.4%',
            yieldScore: 3,
            operator: 'Carlos M.',
            status: 'Finalizado',
            iconType: 'Leaf',
            details: true
        },
        {
            id: 'lot2',
            name: 'Queso Mozzarella',
            isoDate: yesterday.toISOString().split('T')[0],
            date: yesterday.toLocaleDateString('es-ES', {day: 'numeric', month: 'short'}),
            code: '#QM-203',
            weight: 45,
            badge: 'Estándar',
            badgeColor: 'text-gray-400 bg-gray-700/50',
            milk: '450 Litros',
            yieldDisplay: '10%',
            yieldScore: 2,
            operator: 'Juan P.',
            status: 'En Cava',
            iconType: 'Utensils',
            details: true
        }
      ];
  });

  // --- KPI CALCULATIONS (REAL-TIME) ---
  const kpiStats = useMemo(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filter batches for current month
      const monthlyBatches = allBatches.filter(b => {
          const d = new Date(b.isoDate);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const totalWeight = monthlyBatches.reduce((sum, b) => sum + (Number(b.weight) || 0), 0);
      const avgWeight = monthlyBatches.length > 0 ? Math.round(totalWeight / monthlyBatches.length) : 0;

      return { totalWeight, avgWeight };
  }, [allBatches]);

  // --- FILTERED LIST FOR DISPLAY ---
  const displayedBatches = useMemo(() => {
      const targetIso = selectedDate.toISOString().split('T')[0];
      let filtered = allBatches.filter(b => b.isoDate === targetIso);
      
      // Sorting
      if (activeFilter === 'Yield') {
          filtered = [...filtered].sort((a, b) => b.yieldScore - a.yieldScore);
      } else if (activeFilter === 'Type') {
          filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      }
      return filtered;
  }, [allBatches, selectedDate, activeFilter]);

  // --- CHART DATA GENERATION ---
  const historyChartData = useMemo(() => {
      const count = historyPeriod === '7d' ? 7 : historyPeriod === '15d' ? 15 : 30;
      
      return Array.from({ length: count }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (count - 1 - i));
          const iso = d.toISOString().split('T')[0];
          
          // Aggregate real data if available for that day
          const dayBatches = allBatches.filter(b => 
              b.isoDate === iso && 
              (historyCheeseType === 'Todos' || b.name === historyCheeseType)
          );
          
          const dayWeight = dayBatches.reduce((acc, curr) => acc + Number(curr.weight), 0);
          // If no real data, simulate small random background noise for chart aesthetics, or 0
          const weight = dayWeight > 0 ? dayWeight : 0; 

          return {
              day: d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
              weight: weight,
              yield: dayBatches.length > 0 ? '10.5' : '0' // Mock yield if no data
          };
      });
  }, [historyPeriod, historyCheeseType, allBatches]);

  const toggleDetail = (id: string) => {
    setOpenDetailId(openDetailId === id ? null : id);
  };

  const toggleFilter = (filter: 'Yield' | 'Type') => {
      setActiveFilter(activeFilter === filter ? 'None' : filter);
  };

  // Helper for Icon rendering
  const getIcon = (type: string) => {
      if (type === 'Utensils') return Utensils;
      return Leaf;
  };

  // --- HISTORY VIEW ---
  if (showHistory) {
      const totalPeriodWeight = historyChartData.reduce((acc, curr) => acc + curr.weight, 0);
      
      return (
        <div className="min-h-screen bg-[#102216] text-white font-display flex flex-col animate-in slide-in-from-right-10 duration-300">
            {/* History Header */}
            <header className="p-4 pt-6 flex items-center gap-4 bg-[#102216] z-10 border-b border-[#3b5443]">
                <button onClick={() => setShowHistory(false)} className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold tracking-tight text-white">Historial de Producción</h1>
                    <p className="text-xs text-gray-400">Análisis detallado por lote</p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Period Filter */}
                <div className="flex bg-[#1E2923] p-1 rounded-xl border border-[#3b5443]">
                    <button 
                        onClick={() => setHistoryPeriod('7d')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyPeriod === '7d' ? 'bg-[#13ec5b] text-[#111813]' : 'text-gray-400 hover:text-white'}`}
                    >
                        7 Días
                    </button>
                    <button 
                        onClick={() => setHistoryPeriod('15d')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyPeriod === '15d' ? 'bg-[#13ec5b] text-[#111813]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Quincenal
                    </button>
                    <button 
                        onClick={() => setHistoryPeriod('30d')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${historyPeriod === '30d' ? 'bg-[#13ec5b] text-[#111813]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Mensual
                    </button>
                </div>

                {/* Cheese Type Filter */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Filtrar por Producto</label>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {['Todos', 'Queso Costeño', 'Queso Mozzarella', 'Queso Campesino'].map(type => (
                            <button
                                key={type}
                                onClick={() => setHistoryCheeseType(type)}
                                className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${
                                    historyCheeseType === type 
                                    ? 'bg-[#13ec5b]/20 border-[#13ec5b] text-[#13ec5b]' 
                                    : 'bg-transparent border-[#3b5443] text-gray-400 hover:bg-white/5'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-[#1E2923] border border-[#3b5443] rounded-2xl p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-white">Producción (Kg)</h3>
                            <p className="text-[10px] text-gray-400">Tendencia del periodo</p>
                        </div>
                        <div className="flex items-center gap-1 bg-[#13ec5b]/10 px-2 py-1 rounded text-[#13ec5b] text-xs font-bold">
                            <TrendingUp size={14} /> +8%
                        </div>
                    </div>
                    
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historyChartData}>
                                <XAxis 
                                    dataKey="day" 
                                    stroke="#6b7280" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    interval={historyPeriod === '30d' ? 4 : 1}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{backgroundColor: '#102216', border: '1px solid #3b5443', borderRadius: '8px', color: '#fff'}}
                                    labelStyle={{color: '#9ca3af', fontSize: '12px'}}
                                />
                                <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                                    {historyChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.weight > 50 ? '#13ec5b' : '#3b5443'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1E2923] border border-[#3b5443] p-4 rounded-xl">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Total Producido</span>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-white">{totalPeriodWeight}</span>
                            <span className="text-sm text-gray-500 font-bold mb-1">kg</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
      );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#102216] text-white font-display flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="flex flex-none items-center justify-between p-4 pt-6 bg-[#102216] z-10">
        <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1 text-center">Producción de Queso</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* KPI Cards (DYNAMIC) */}
        <section className="px-4 py-2">
            <div className="grid grid-cols-2 gap-3">
                {/* Total Mensual */}
                <div className="flex flex-col items-start justify-between rounded-2xl bg-[#1E2923] p-4 border border-[#3b5443] shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-[#13ec5b]/10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-2 mb-3 z-10">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#13ec5b]/20 text-[#13ec5b]">
                            <Scale size={18} />
                        </span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Mensual</span>
                    </div>
                    <p className="text-3xl font-extrabold text-white z-10">
                        {kpiStats.totalWeight.toLocaleString('es-CO')} <span className="text-lg font-medium text-gray-400">kg</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#13ec5b] z-10">
                        <TrendingUp size={14} />
                        <span>Este Mes</span>
                    </div>
                </div>

                {/* Promedio Lote */}
                <div className="flex flex-col items-start justify-between rounded-2xl bg-[#1E2923] p-4 border border-[#3b5443] shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-[#FFB800]/10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-2 mb-3 z-10">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#FFB800]/20 text-[#FFB800]">
                            <PieChart size={18} />
                        </span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Promedio Lote</span>
                    </div>
                    <p className="text-3xl font-extrabold text-white z-10">
                        {kpiStats.avgWeight} <span className="text-lg font-medium text-gray-400">kg</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 z-10">
                        <CheckCircle2 size={14} />
                        <span>Estable</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Calendar Strip */}
        <section className="mt-4 px-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-300 capitalize">
                    {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(selectedDate)}
                </h2>
                
                <div className="relative group">
                    <input 
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                            if(!e.target.value) return;
                            const [y, m, d] = e.target.value.split('-').map(Number);
                            const newDate = new Date(y, m - 1, d);
                            setSelectedDate(newDate);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button 
                        className="flex items-center gap-1 text-[#13ec5b] font-bold text-sm group-hover:text-white transition-colors"
                    >
                        <Calendar size={18} />
                        <span className="underline decoration-dashed underline-offset-4 decoration-[#13ec5b]/50">
                            {selectedDate.toDateString() === new Date().toDateString() ? 'Hoy' : 'Cambiar'}
                        </span>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x">
                {daysStrip.map((dateObj) => {
                    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
                    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(dateObj).replace('.', '');
                    const dayNumber = dateObj.getDate();
                    
                    return (
                        <button 
                            key={dateObj.toISOString()}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`snap-start shrink-0 flex flex-col items-center justify-center w-[4.5rem] h-[5.5rem] rounded-2xl border transition-all ${
                                isSelected 
                                ? 'bg-[#13ec5b] text-[#111813] border-[#13ec5b] shadow-[0_0_15px_rgba(19,236,91,0.3)] scale-105' 
                                : 'bg-[#28392e] border-transparent hover:border-[#3b5443] text-white'
                            }`}
                        >
                            <span className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${isSelected ? 'text-[#111813]/80' : 'text-gray-400'}`}>
                                {dayName}
                            </span>
                            <span className="text-xl font-bold">{dayNumber}</span>
                        </button>
                    )
                })}
            </div>
        </section>

        {/* Filters */}
        <section className="mt-2 px-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                <button 
                    onClick={() => toggleFilter('Yield')}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        activeFilter === 'Yield' 
                        ? 'bg-[#13ec5b] text-[#111813] border-[#13ec5b] shadow-lg' 
                        : 'border-[#3b5443] bg-transparent text-white hover:bg-[#3b5443]/30'
                    }`}
                >
                    <TrendingUp size={18} className={activeFilter === 'Yield' ? 'text-[#111813]' : 'text-gray-400'} />
                    Rendimiento
                </button>
                <button 
                    onClick={() => toggleFilter('Type')}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        activeFilter === 'Type' 
                        ? 'bg-[#13ec5b] text-[#111813] border-[#13ec5b] shadow-lg' 
                        : 'border-[#3b5443] bg-transparent text-white hover:bg-[#3b5443]/30'
                    }`}
                >
                    <LayoutGrid size={18} className={activeFilter === 'Type' ? 'text-[#111813]' : 'text-gray-400'} />
                    Tipo
                </button>
            </div>
        </section>

        {/* List Header */}
        <div className="px-4 pt-4 pb-2 flex justify-between items-end">
            <h3 className="text-lg font-bold text-white">
                {activeFilter === 'None' ? 'Lotes Recientes' : activeFilter === 'Yield' ? 'Ordenado por Rendimiento' : 'Ordenado por Tipo'}
            </h3>
            <button 
                onClick={() => setShowHistory(true)} 
                className="text-xs text-[#13ec5b] font-bold uppercase tracking-wide cursor-pointer hover:underline bg-[#13ec5b]/10 px-2 py-1 rounded-md border border-[#13ec5b]/20 flex items-center gap-1"
            >
                <History size={12} />
                Ver Historial
            </button>
        </div>

        {/* Dynamic List */}
        <section className="flex flex-col gap-3 px-4 pb-4">
            {displayedBatches.length === 0 ? (
                <div className="py-10 text-center opacity-50">
                    <p className="text-sm font-bold text-gray-400">No hay lotes para esta fecha</p>
                    <p className="text-xs text-gray-500">Intenta seleccionar otro día</p>
                </div>
            ) : (
                displayedBatches.map((batch) => {
                    const Icon = getIcon(batch.iconType);
                    return (
                        <div key={batch.id} className={`rounded-2xl bg-[#28392e] border border-[#3b5443] overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-2 ${openDetailId === batch.id ? 'shadow-xl ring-1 ring-[#13ec5b]/50' : ''}`}>
                            <div 
                                onClick={() => toggleDetail(batch.id)}
                                className="flex cursor-pointer items-center justify-between p-4 hover:bg-white/5 transition-colors select-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#102216] border border-[#3b5443]">
                                        <Icon size={24} className={batch.name.includes('Costeño') ? 'text-[#13ec5b]' : 'text-[#FFB800]'} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white text-base">{batch.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {batch.date} • {batch.code}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-white text-lg">{batch.weight} kg</span>
                                        <span className={`text-[10px] px-1.5 rounded ${batch.badgeColor}`}>{batch.badge}</span>
                                    </div>
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openDetailId === batch.id ? 'rotate-180 text-[#13ec5b]' : ''}`} />
                                </div>
                            </div>
                            {openDetailId === batch.id && (
                                <div className="border-t border-[#3b5443] bg-black/20 p-4 animate-in slide-in-from-top-2">
                                    {batch.details ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Leche Usada</span>
                                                    <span className="text-sm text-gray-200 font-medium flex items-center gap-1">
                                                        <Droplets size={16} className="text-blue-400" /> {batch.milk}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Rendimiento</span>
                                                    <span className="text-sm text-gray-200 font-medium flex items-center gap-1">
                                                        <Percent size={16} className="text-[#13ec5b]" /> {batch.yieldDisplay}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Operario</span>
                                                    <span className="text-sm text-gray-200 font-medium flex items-center gap-1">
                                                        <User size={16} className="text-[#FFB800]" /> {batch.operator}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Estado</span>
                                                    <span className="text-sm text-[#13ec5b] font-medium flex items-center gap-1">
                                                        <BadgeCheck size={16} /> {batch.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <button 
                                                    onClick={() => navigate(`/cheese-batch/${batch.id}`)}
                                                    className="text-xs font-bold text-[#13ec5b] hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    VER FICHA COMPLETA <ArrowUpRight size={14} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 text-sm">Detalles adicionales no disponibles para este lote.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-20">
        <button 
            onClick={() => navigate('/register-cheese')}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-[#13ec5b] px-5 py-4 text-[#111813] shadow-[0_0_20px_rgba(19,236,91,0.4)] transition-transform hover:scale-105 active:scale-95"
        >
            <Plus size={24} className="font-bold" />
            <span className="text-base font-bold pr-1">Añadir</span>
        </button>
      </div>

      {/* Custom Bottom Nav */}
      <nav className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-around border-t border-[#3b5443] bg-[#111813] px-2 shadow-lg z-30 shrink-0">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1 p-2 text-gray-400 hover:text-[#13ec5b] transition-colors">
            <LayoutGrid size={24} />
            <span className="text-[10px] font-medium">Resumen</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 p-2 text-[#13ec5b]">
            <Cookie size={24} />
            <span className="text-[10px] font-medium">Quesos</span>
        </button>
        <button onClick={() => navigate('/cheese-sales')} className="flex flex-col items-center justify-center gap-1 p-2 text-gray-400 hover:text-[#13ec5b] transition-colors">
            <Store size={24} />
            <span className="text-[10px] font-medium">Ventas</span>
        </button>
      </nav>

    </div>
  );
};

export default AddCheese;
