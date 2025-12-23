import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, TrendingUp, Cake, Weight, Sparkles, BrainCircuit, Edit2, Plus, Droplets, Stethoscope, MessageSquareText, Dna, Baby, Calendar, AlertCircle, Syringe, Pill, Bell, ChevronRight, BriefcaseMedical, Scan, Scale, TrendingDown, ArrowRight, List, Activity, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';

const AnimalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('General');
  
  // State for Sub-tabs
  const [healthSubTab, setHealthSubTab] = useState<'Vaccination' | 'Treatments'>('Vaccination');
  const [productionType, setProductionType] = useState<'Milk' | 'Weight'>('Milk');

  // Mock Data: Milk Chart
  const milkData = [
    { day: '0', val: 0 }, { day: '30', val: 20 }, { day: '60', val: 28 },
    { day: '90', val: 32 }, { day: '120', val: 30 }, { day: '150', val: 26 },
    { day: '180', val: 22 }, { day: '210', val: 18 }, { day: '270', val: 12 },
  ];

  // Mock Data: Milk History (NEW)
  const milkHistory = [
    { id: 1, date: 'Hoy, 06:00 AM', amount: 12.5, quality: 'Premium', shift: 'AM' },
    { id: 2, date: 'Ayer, 05:30 PM', amount: 11.8, quality: 'Standard', shift: 'PM' },
    { id: 3, date: 'Ayer, 06:00 AM', amount: 13.2, quality: 'Premium', shift: 'AM' },
    { id: 4, date: '10 Oct, 05:45 PM', amount: 11.5, quality: 'Standard', shift: 'PM' },
  ];

  // Mock Data: Weight History
  const weightHistory = [
      { id: 1, date: '12 Oct, 2023', weight: 450, change: '+12 kg', type: 'gain', event: 'Pesaje Rutina' },
      { id: 2, date: '12 Sep, 2023', weight: 438, change: '+8 kg', type: 'gain', event: 'Pesaje Mensual' },
      { id: 3, date: '12 Ago, 2023', weight: 430, change: '-2 kg', type: 'loss', event: 'Post-Enfermedad' },
      { id: 4, date: '12 Jul, 2023', weight: 432, change: '+15 kg', type: 'gain', event: 'Pesaje Mensual' },
  ];

  // Mock Data: Weight Chart
  const weightChartData = [
      { month: 'Ene', val: 380 },
      { month: 'Feb', val: 395 },
      { month: 'Mar', val: 410 },
      { month: 'Abr', val: 422 },
      { month: 'May', val: 435 },
      { month: 'Jun', val: 452 },
  ];

  const tabs = {
      'General': 'General',
      'Production': 'Producción',
      'Health': 'Sanidad',
      'Reproduction': 'Reproducción'
  }

  // Mock Vaccination Data
  const vaccinations = [
      { id: 1, name: 'Fiebre Aftosa', date: '12 Oct 23', dose: '2ml (IM)', batch: 'A234-X', type: 'Obligatoria', status: 'Done' },
      { id: 2, name: 'Brucelosis', date: '15 Ene 23', dose: 'Cepa 19', batch: 'B-99', type: 'Cepa 19', status: 'Done', vet: 'Dr. Miguel Santos' },
      { id: 3, name: 'Carbunco', date: '20 Nov 22', dose: '1 Dosis', batch: 'C-01', type: 'Rutina', status: 'Done' },
  ];

  // Mock Treatment Data
  const treatments = [
      { id: 1, name: 'Mastitis Leve', date: '05 Nov 23', status: 'Finished', description: 'Tratamiento con Antibiótico X por 5 días.', type: 'Curativo' },
      { id: 2, name: 'Desparasitación', date: '10 Sep 23', status: 'Finished', description: 'Ivermectina al 1%', type: 'Preventivo' },
  ];

  // Mock Health Summary for General Tab
  const healthSummary = [
      { id: 1, type: 'Vaccine', title: 'Vacuna Aftosa', date: '12 Oct, 2023', desc: 'Dosis semestral regular.', color: 'text-blue-400' },
      { id: 2, type: 'Treatment', title: 'Tratamiento Mastitis', date: '05 Ago, 2023', desc: 'Antibiótico (3 días). Leche retenida.', color: 'text-red-400' },
      { id: 3, type: 'Checkup', title: 'Chequeo General', date: '15 Ene, 2023', desc: 'Condición corporal excelente.', color: 'text-green-400' },
  ];

  // Mock Calves
  const calves = [
      { id: '#4093', name: 'Benny', date: '14 Feb 2023', sex: 'Male', status: 'Easy Calving' },
      { id: '#3011', name: 'Luna', date: '25 Jan 2022', sex: 'Female', status: 'Assisted' },
  ];

  // Mock Pedigree Data
  const pedigree = {
      father: { name: 'Thunderbolt', tag: '#9921', breed: 'Brahman', img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop' },
      mother: { name: 'Bessie', tag: '#1029', breed: 'Brahman', img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=100&h=100' },
  };

  const navigateToWeight = () => {
      setProductionType('Weight');
      setActiveTab('Production');
  };

  return (
    <div className="bg-background-dark min-h-screen text-white font-display flex flex-col relative">
      {/* Parallax Header Image */}
      <div className="relative w-full h-80 shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark"></div>
        
        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-50">
          <button 
            onClick={() => navigate('/inventory')} 
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 text-white cursor-pointer transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button 
                onClick={() => navigate(`/edit-bovine/${id}`)}
                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 text-white cursor-pointer transition-colors active:scale-95"
            >
                <Edit2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 text-white cursor-pointer transition-colors active:scale-95"><Share2 size={18} /></button>
          </div>
        </div>

        {/* Header Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm mb-2">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                <span className="text-xs font-bold text-primary tracking-wide uppercase">Activa - Ordeño</span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-1">Lola</h1>
              <p className="text-gray-300 text-lg font-medium">#5783-2 • Holstein Friesian</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold text-white">450 <span className="text-sm font-normal text-gray-400">kg</span></span>
              <span className="text-xs text-primary font-bold flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                <TrendingUp size={14} className="mr-1" /> +2.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 w-full overflow-x-auto no-scrollbar">
        <div className="flex min-w-full px-4">
          {Object.entries(tabs).map(([key, label]) => (
            <button 
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 min-w-[100px] py-4 border-b-[3px] transition-colors text-sm font-bold tracking-wide ${activeTab === key ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* ==================== GENERAL TAB (SUMMARY DASHBOARD) ==================== */}
        {activeTab === 'General' && (
          <div className="space-y-6">
            
            {/* Genealogy Section */}
            <div>
                <div className="flex items-center justify-between px-1 mb-2">
                    <h2 className="text-lg font-bold">Árbol Genealógico</h2>
                    <button 
                        onClick={() => navigate(`/genealogy/${id}`)}
                        className="text-primary text-xs font-bold tracking-wider uppercase hover:underline"
                    >
                        Ver Completo
                    </button>
                </div>
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 relative">
                    <div className="flex justify-between items-center relative">
                        {/* Horizontal Connector */}
                        <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-white/10"></div>
                        
                        {/* Father */}
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-blue-500/20 mb-2 bg-surface-darker">
                                <img src={pedigree.father.img} className="w-full h-full rounded-full object-cover filter brightness-90" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Padre</span>
                            <h3 className="text-white text-sm font-bold">{pedigree.father.name}</h3>
                            <p className="text-gray-500 text-[10px]">{pedigree.father.tag}</p>
                        </div>

                        {/* Mother */}
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-pink-500/20 mb-2 bg-surface-darker">
                                <img src={pedigree.mother.img} className="w-full h-full rounded-full object-cover filter brightness-90" />
                            </div>
                            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-0.5">Madre</span>
                            <h3 className="text-white text-sm font-bold">{pedigree.mother.name}</h3>
                            <p className="text-gray-500 text-[10px]">{pedigree.mother.tag}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex flex-col justify-center h-24">
                    <div className="flex items-center gap-2 mb-1">
                        <Cake className="text-accent-amber" size={18} />
                        <span className="text-xs text-gray-400">Edad</span>
                    </div>
                    <p className="text-xl font-bold">3 Años</p>
                    <p className="text-gray-500 text-[10px]">4 Meses</p>
                </div>
                <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex flex-col justify-center h-24">
                     <div className="flex items-center gap-2 mb-1">
                        <Weight className="text-primary" size={18} />
                        <span className="text-xs text-gray-400">Último Peso</span>
                    </div>
                    <p className="text-xl font-bold">450 kg</p>
                    <p className="text-gray-500 text-[10px]">12 Oct 2023</p>
                </div>
            </div>

            {/* Milk Summary */}
            <div>
                 <div className="flex justify-between items-center px-1 mb-2">
                     <div>
                         <h2 className="text-lg font-bold">Curva de Leche</h2>
                         <p className="text-xs text-gray-400">Periodo Lactancia #2</p>
                     </div>
                     <div className="bg-surface-dark border border-white/10 px-2 py-1 rounded text-right">
                         <span className="block text-[10px] text-gray-400 uppercase">Promedio</span>
                         <span className="text-primary font-bold text-sm">24.5 L/día</span>
                     </div>
                 </div>
                 <div className="bg-surface-dark rounded-xl border border-white/5 p-4 relative overflow-hidden">
                     {/* Floating Badge */}
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-3 py-1 rounded-full shadow-lg z-10 text-sm">
                         32.5 L
                     </div>
                     <div className="h-40 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={milkData}>
                                <defs>
                                    <linearGradient id="colorMilkGeneral" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#11d421" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#11d421" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="val" stroke="#11d421" strokeWidth={3} fill="url(#colorMilkGeneral)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-2 border-t border-white/5 pt-2 border-dashed">
                         <span>Día 0</span>
                         <span>Día 90</span>
                         <span>Día 180</span>
                         <span>Día 270</span>
                     </div>
                 </div>
            </div>

            {/* Weight Control Summary */}
            <div>
                <div className="flex items-center justify-between px-1 mb-2">
                    <h2 className="text-lg font-bold">Control de Peso</h2>
                    <span className="text-[10px] border border-white/20 px-1.5 py-0.5 rounded text-gray-400 uppercase">Bovino</span>
                </div>

                <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">
                    {/* Date Range Header */}
                    <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-amber/10 text-accent-amber">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Rango Seleccionado</p>
                                <p className="text-xs font-bold text-white">Ene 01 - Jun 30, 2023</p>
                            </div>
                        </div>
                        <Edit2 size={16} className="text-gray-500" />
                    </div>

                    {/* Chart Body */}
                    <div className="p-5 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-3xl font-bold text-white">452</h3>
                                    <span className="text-sm text-gray-400">kg</span>
                                </div>
                                <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">+12kg vs inicio</span>
                            </div>
                            <button 
                                onClick={() => navigate(`/add-weight/${id}`)}
                                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                                <Plus size={14} className="text-accent-amber" /> Registrar
                            </button>
                        </div>

                        {/* Mini Line Chart */}
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightChartData}>
                                    <defs>
                                        <linearGradient id="colorWeightGeneral" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FFB300" stopOpacity={0.2}/>
                                            <stop offset="100%" stopColor="#FFB300" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Tooltip contentStyle={{backgroundColor: '#18281a', borderRadius: '8px', border: 'none'}} itemStyle={{color: '#FFB300'}} />
                                    <Area type="monotone" dataKey="val" stroke="#FFB300" strokeWidth={3} fill="url(#colorWeightGeneral)" dot={{r: 4, fill: "#FFB300", strokeWidth: 0}} />
                                    <XAxis dataKey="month" hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Fake X-Axis labels */}
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase font-bold px-2">
                             <span>Ene</span>
                             <span>Feb</span>
                             <span>Mar</span>
                             <span>Abr</span>
                             <span>May</span>
                             <span>Jun</span>
                        </div>
                    </div>

                    {/* Footer / Link */}
                    <button 
                        onClick={navigateToWeight}
                        className="w-full py-3 bg-black/20 flex items-center justify-between px-4 text-xs font-bold text-gray-300 hover:text-white transition-colors border-t border-white/5"
                    >
                        <span className="flex items-center gap-2"><List size={16} /> Todos los Registros</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Health History Summary */}
            <div>
                <h2 className="text-lg font-bold mb-3 px-1">Historial Sanitario</h2>
                <div className="relative space-y-4 pl-4">
                     {/* Connector Line */}
                     <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10"></div>

                     {healthSummary.map((item) => (
                         <div key={item.id} className="relative pl-6">
                             {/* Dot */}
                             <div className={`absolute left-[15px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background-dark z-10 ${
                                 item.type === 'Vaccine' ? 'bg-blue-500' : 
                                 item.type === 'Treatment' ? 'bg-red-500' : 'bg-green-500'
                             }`}></div>
                             
                             <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
                                 <div className="bg-surface-dark border border-white/5 p-3 rounded-lg hover:border-white/20 transition-colors">
                                     <div className="flex items-center gap-2 mb-1">
                                        {item.type === 'Vaccine' && <Syringe size={14} className="text-blue-400" />}
                                        {item.type === 'Treatment' && <BriefcaseMedical size={14} className="text-red-400" />}
                                        {item.type === 'Checkup' && <CheckCircle2 size={14} className="text-green-400" />}
                                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                     </div>
                                     <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                 </div>
                             </div>
                         </div>
                     ))}
                </div>
            </div>

            {/* Birth Records Summary */}
            <div>
                <h2 className="text-lg font-bold mb-3 px-1">Registros de Partos</h2>
                
                {/* Interval Highlight */}
                <div className="bg-[#2a2410] border border-[#FFB300]/20 rounded-xl p-4 flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-[#FFB300] font-bold uppercase tracking-wider">Intervalo entre partos</p>
                        <p className="text-[10px] text-gray-400">Último intervalo registrado</p>
                    </div>
                    <span className="text-2xl font-bold text-[#FFB300]">385 <span className="text-xs font-normal text-gray-400">días</span></span>
                </div>

                <div className="space-y-2">
                    {calves.map((calf, index) => (
                        <div key={index} className="bg-surface-dark border border-white/5 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 text-lg">
                                    #{calves.length - index}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Cría: {calf.name} ({calf.id})</h4>
                                    <p className="text-[10px] text-gray-400">Nac: {calf.date} • {calf.status}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                calf.sex === 'Female' 
                                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' 
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                            }`}>
                                {calf.sex === 'Female' ? 'Hembra' : 'Macho'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Spacer */}
            <div className="h-4"></div>

          </div>
        )}

        {/* Production Tab */}
        {activeTab === 'Production' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              
              {/* Type Switcher (Milk vs Weight) */}
              <div className="bg-surface-dark border border-white/10 p-1 rounded-xl flex">
                 <button 
                     onClick={() => setProductionType('Milk')}
                     className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                         productionType === 'Milk' 
                         ? 'bg-white text-black shadow-sm' 
                         : 'text-gray-400 hover:text-white'
                     }`}
                 >
                     <Droplets size={16} /> Leche
                 </button>
                 <button 
                     onClick={() => setProductionType('Weight')}
                     className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                         productionType === 'Weight' 
                         ? 'bg-white text-black shadow-sm' 
                         : 'text-gray-400 hover:text-white'
                     }`}
                 >
                     <Scale size={16} /> Peso / Carne
                 </button>
              </div>

              {/* MILK VIEW */}
              {productionType === 'Milk' && (
                  <div className="space-y-4 animate-in fade-in">
                    <button 
                        onClick={() => navigate(`/add-production/${id}`)}
                        className="w-full bg-primary hover:bg-primary-dark text-background-dark py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        <Plus size={24} />
                        <span className="flex items-center gap-1">Registrar <Droplets size={18} fill="currentColor" /></span>
                    </button>

                    <div className="flex justify-between items-center mt-2">
                        <div>
                            <h2 className="text-lg font-bold">Curva de Leche</h2>
                            <p className="text-xs text-gray-400">Periodo de Lactancia #2</p>
                        </div>
                        <div className="bg-surface-dark border border-white/10 rounded-lg px-3 py-1.5 text-right">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide block">Promedio</span>
                            <span className="text-primary font-bold">24.5 L/día</span>
                        </div>
                    </div>
                    
                    <div className="h-64 bg-surface-dark rounded-xl border border-white/5 pt-6 pr-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={milkData}>
                                <defs>
                                    <linearGradient id="colorMilk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#11d421" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#11d421" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#555" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{backgroundColor: '#18281a', borderColor: '#333', color: '#fff'}} itemStyle={{color: '#11d421'}} />
                                <Area type="monotone" dataKey="val" stroke="#11d421" strokeWidth={3} fillOpacity={1} fill="url(#colorMilk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* NEW: Milk History List */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg">Historial de Ordeño</h3>
                            <button className="text-xs text-primary font-bold hover:underline">Ver Todo</button>
                        </div>
                        <div className="space-y-0">
                            {milkHistory.map((record, index) => (
                                <div key={record.id} className="relative pl-6 py-3 border-l border-white/10 last:border-0">
                                     <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-background-dark ${index === 0 ? 'bg-primary' : 'bg-gray-600'}`}></div>
                                     <div className="flex items-center justify-between bg-surface-dark border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                                        <div>
                                             <div className="flex items-center gap-2">
                                                <p className="font-bold text-sm text-white">{record.date}</p>
                                                <span className={`text-[10px] font-bold px-1 rounded ${record.shift === 'AM' ? 'text-yellow-400 bg-yellow-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
                                                    {record.shift}
                                                </span>
                                             </div>
                                             <span className={`text-[10px] px-1.5 py-0.5 rounded border mt-1 inline-block ${record.quality === 'Premium' ? 'border-accent-amber/30 text-accent-amber bg-accent-amber/10' : 'border-gray-600 text-gray-400'}`}>
                                                Calidad {record.quality}
                                             </span>
                                        </div>
                                        <div className="text-right">
                                             <p className="font-bold text-white text-base">{record.amount} L</p>
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
              )}

              {/* WEIGHT VIEW */}
              {productionType === 'Weight' && (
                  <div className="space-y-6 animate-in fade-in">
                    
                    {/* Weight Header Card */}
                    <div className="bg-surface-dark rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mb-1">Peso Actual</p>
                                <div className="flex items-baseline gap-1">
                                    <h2 className="text-5xl font-extrabold text-white">450</h2>
                                    <span className="text-xl text-gray-500 font-medium">kg</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(`/add-weight/${id}`)}
                                className="bg-accent-amber text-black p-3 rounded-xl shadow-lg shadow-accent-amber/20 hover:scale-105 transition-transform active:scale-95 z-10 cursor-pointer"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                <TrendingUp size={16} className="text-primary" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Últimos 30 días</p>
                                    <p className="text-sm font-bold text-white">+12 kg</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                <Scale size={16} className="text-blue-400" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">G.D.P (Ganancia)</p>
                                    <p className="text-sm font-bold text-white">0.8 kg/día</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weight Chart */}
                    <div>
                        <h3 className="font-bold text-lg mb-3">Curva de Crecimiento</h3>
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightChartData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFB300" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#FFB300" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="month" stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#18281a', borderColor: '#333', color: '#fff', borderRadius: '8px'}} 
                                        itemStyle={{color: '#FFB300'}}
                                        formatter={(value) => [`${value} kg`, 'Peso']}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#FFB300" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weight History List */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg">Historial de Pesajes</h3>
                            <button className="text-xs text-primary font-bold hover:underline">Ver Todo</button>
                        </div>
                        
                        <div className="space-y-0">
                            {weightHistory.map((record, index) => (
                                <div key={record.id} className="relative pl-6 py-3 border-l border-white/10 last:border-0">
                                    <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-background-dark ${index === 0 ? 'bg-primary' : 'bg-gray-600'}`}></div>
                                    
                                    <div className="flex items-center justify-between bg-surface-dark border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                                        <div>
                                            <p className="font-bold text-sm text-white">{record.date}</p>
                                            <p className="text-xs text-gray-500">{record.event}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white text-base">{record.weight} kg</p>
                                            <div className={`flex items-center justify-end gap-1 text-xs font-bold ${record.type === 'gain' ? 'text-primary' : 'text-red-400'}`}>
                                                {record.type === 'gain' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {record.change}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                  </div>
              )}
           </div>
        )}

        {/* Reproduction Tab */}
        {activeTab === 'Reproduction' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Register Button */}
              <button 
                onClick={() => navigate(`/add-reproduction/${id}`)}
                className="w-full bg-surface-dark hover:bg-white/5 text-purple-400 border border-purple-500/30 hover:border-purple-500 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                  <Plus size={20} />
                  <span className="flex items-center gap-1">Evento Reproductivo <Dna size={16} /></span>
              </button>

              {/* Status Card (PREGNANT) */}
              <div className="bg-surface-dark rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500">
                    <Baby size={80} />
                 </div>
                 <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 inline-block">Estado: Preñada</span>
                    
                    <div className="mb-4">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-3xl font-bold text-white">5.5 <span className="text-sm font-normal text-gray-400">Meses</span></span>
                           <span className="text-sm font-bold text-gray-400">Gestación</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-background-dark rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-[60%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wide">
                            <span>Concepción</span>
                            <span>Secado</span>
                            <span>Parto</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Fecha Probable Parto</p>
                                <p className="text-sm font-bold text-white">24 Ene, 2024</p>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Health / Gemini - REDESIGNED */}
        {activeTab === 'Health' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 
                 {/* Top Stats Cards */}
                 <div className="grid grid-cols-2 gap-3">
                     <div className="bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                         <div className="flex items-start justify-between mb-2">
                             <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                                 <Syringe size={18} />
                             </div>
                             <span className="text-[10px] text-gray-400">Reciente</span>
                         </div>
                         <div>
                             <p className="text-xs text-gray-400">Última Vacuna</p>
                             <p className="text-sm font-bold text-white">12 Oct 23</p>
                         </div>
                     </div>
                     <div className="bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                         <div className="flex items-start justify-between mb-2">
                             <div className="p-2 rounded-full bg-accent-amber/10 text-accent-amber">
                                 <BriefcaseMedical size={18} />
                             </div>
                             <span className="text-[10px] text-gray-400">Estado</span>
                         </div>
                         <div>
                             <p className="text-xs text-gray-400">Tratamiento</p>
                             <p className="text-sm font-bold text-white">Activo</p>
                         </div>
                     </div>
                 </div>

                 {/* Sub-Tabs Switcher */}
                 <div className="bg-surface-dark border border-white/10 p-1 rounded-xl flex">
                     <button 
                         onClick={() => setHealthSubTab('Vaccination')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                             healthSubTab === 'Vaccination' 
                             ? 'bg-white text-black shadow-sm' 
                             : 'text-gray-400 hover:text-white'
                         }`}
                     >
                         Vacunación
                     </button>
                     <button 
                         onClick={() => setHealthSubTab('Treatments')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                             healthSubTab === 'Treatments' 
                             ? 'bg-white text-black shadow-sm' 
                             : 'text-gray-400 hover:text-white'
                         }`}
                     >
                         Tratamientos
                     </button>
                 </div>

                 {/* --- VACCINATION VIEW --- */}
                 {healthSubTab === 'Vaccination' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        
                        {/* Next Booster Alert Card */}
                        <div className="bg-accent-amber/10 border-l-4 border-accent-amber rounded-r-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-accent-amber uppercase mb-1 block">Próximo Refuerzo Pendiente</span>
                                <h3 className="text-lg font-bold text-white mb-0.5">Fiebre Aftosa</h3>
                                <p className="text-xs text-gray-300">Fecha límite: <span className="text-white font-bold">12 Abr 2024</span></p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-accent-amber text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,193,7,0.3)] animate-pulse">
                                <Bell size={20} fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <h3 className="font-bold text-lg">Historial de Vacunación</h3>
                            <span className="text-xs text-gray-400">Recientes</span>
                        </div>

                        {/* Vaccination Timeline */}
                        <div className="space-y-0 relative">
                             {/* Line */}
                             <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10"></div>

                             {vaccinations.map((vax) => (
                                 <div key={vax.id} className="relative pl-14 py-3 group">
                                     {/* Icon Node */}
                                     <div className={`absolute left-3 top-3.5 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 bg-background-dark ${vax.id === 1 ? 'border-primary text-primary' : 'border-gray-600 text-gray-500'}`}>
                                        {vax.id === 1 ? <Syringe size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
                                     </div>

                                     {/* Card */}
                                     <div className="bg-surface-dark border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                                         <div className="flex justify-between items-start mb-2">
                                             <div>
                                                 <h4 className="font-bold text-base text-white">{vax.name}</h4>
                                                 {vax.type === 'Obligatoria' && (
                                                     <span className="inline-block px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 mt-1">Obligatoria</span>
                                                 )}
                                                  {vax.type === 'Cepa 19' && (
                                                     <span className="inline-block px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 text-[10px] font-bold border border-gray-600 mt-1">Cepa 19</span>
                                                 )}
                                             </div>
                                             <div className="text-right">
                                                 <span className="block text-xs font-bold bg-white/10 px-2 py-1 rounded text-white">{vax.date}</span>
                                             </div>
                                         </div>
                                         
                                         <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-2 pt-2 border-t border-white/5">
                                             <div>
                                                 <span className="block text-[10px] uppercase text-gray-500">Dosis</span>
                                                 <span className="text-white">{vax.dose}</span>
                                             </div>
                                             <div>
                                                 <span className="block text-[10px] uppercase text-gray-500">Lote</span>
                                                 <span className="text-white">{vax.batch}</span>
                                             </div>
                                             {vax.vet && (
                                                 <div className="col-span-2">
                                                     <span className="block text-[10px] uppercase text-gray-500">Responsable</span>
                                                     <span className="text-white">{vax.vet}</span>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                     </div>
                 )}

                 {/* --- TREATMENTS VIEW --- */}
                 {healthSubTab === 'Treatments' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">Últimos Tratamientos</h3>
                            <button className="text-xs font-bold text-primary">Ver todo</button>
                        </div>

                        {treatments.map((tx) => (
                            <div key={tx.id} className="bg-surface-dark border border-white/5 rounded-xl p-4 flex gap-4 items-start">
                                <div className="p-3 rounded-xl bg-red-500/10 text-red-400 shrink-0">
                                    <BriefcaseMedical size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-base text-white">{tx.name}</h4>
                                        <span className="text-xs text-gray-500">{tx.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-2">
                                        {tx.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wide">Finalizado</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}

                 {/* Register Button & Gemini (Always visible at bottom) */}
                 <div className="pt-2 space-y-4">
                    <button 
                        onClick={() => navigate(`/add-health/${id}`)}
                        className="w-full bg-primary hover:bg-primary-dark text-background-dark py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        <Plus size={24} />
                        <span className="flex items-center gap-1">Registrar Nuevo</span>
                    </button>

                     {/* Gemini Card */}
                     <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/20 relative overflow-hidden group">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                <BrainCircuit size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm text-indigo-100">Consultar IA Veterinaria</h4>
                                <p className="text-xs text-indigo-300">¿Dudas sobre síntomas o dosis?</p>
                             </div>
                             <button 
                                onClick={() => navigate(`/veterinary-ai/${id}`)}
                                className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                             >
                                <ChevronRight size={20} />
                             </button>
                         </div>
                     </div>
                 </div>

             </div>
        )}
      </div>
    </div>
  );
};

export default AnimalDetail;