import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, TrendingUp, Cake, Weight, BrainCircuit, Edit2, Plus, Droplets, Syringe, Bell, ChevronRight, BriefcaseMedical, CheckCircle2, List, Calendar, Baby, Dna, Scale, TrendingDown, X } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { allBovines } from '../mockData';

const AnimalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('General');
  
  // Find the animal based on ID
  const animal = allBovines.find(b => b.id === id);

  // State for Sub-tabs
  const [healthSubTab, setHealthSubTab] = useState<'Vaccination' | 'Treatments'>('Vaccination');
  const [productionType, setProductionType] = useState<'Milk' | 'Weight'>('Milk');

  // --- SHARE MODAL STATE ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareOptions, setShareOptions] = useState({
      general: true,
      genealogy: true,
      production: false,
      health: false
  });

  if (!animal) {
    return (
        <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold">Bovino no encontrado</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary underline">Volver</button>
            </div>
        </div>
    );
  }

  // Mock Data definitions (moved up for scope access in share function)
  const pedigree = {
      father: { name: 'Thunderbolt', tag: '#9921', breed: animal.breed, img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop' },
      mother: { name: 'Bessie', tag: '#1029', breed: animal.breed, img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=100&h=100' },
  };
  const vaccinations = [
      { id: 1, name: 'Fiebre Aftosa', date: '12 Oct 23', dose: '2ml (IM)', batch: 'A234-X', type: 'Obligatoria', status: 'Done' },
      { id: 2, name: 'Brucelosis', date: '15 Ene 23', dose: 'Cepa 19', batch: 'B-99', type: 'Cepa 19', status: 'Done', vet: 'Dr. Miguel Santos' },
      { id: 3, name: 'Carbunco', date: '20 Nov 22', dose: '1 Dosis', batch: 'C-01', type: 'Rutina', status: 'Done' },
  ];

  // --- SHARE FUNCTIONALITY ---
  const executeShare = async () => {
      let text = `🐄 *Ficha Técnica: ${animal.tag}*\n`;
      
      if (shareOptions.general) {
          text += `\n📌 *GENERAL*\n` +
                  `Raza: ${animal.breed}\n` +
                  `Edad: ${animal.age}\n` +
                  `Peso: ${animal.weight} kg\n` +
                  `Estado: ${animal.status}\n` +
                  `Ubicación: Finca #${animal.farmId}\n`;
      }

      if (shareOptions.genealogy) {
          text += `\n🧬 *GENEALOGÍA*\n` +
                  `Padre: ${pedigree.father.name} (${pedigree.father.tag})\n` +
                  `Madre: ${pedigree.mother.name} (${pedigree.mother.tag})\n`;
      }
      
      if (shareOptions.production) {
           if (animal.category === 'Cow') {
               text += `\n🥛 *PRODUCCIÓN (Leche)*\nPromedio Actual: 24.5 L/día\nUlt. Ordeño: 12.5 L (AM)\n`;
           } else {
               text += `\n⚖️ *CRECIMIENTO*\nGanancia: +12kg (Ult. 30 días)\nPromedio: 0.8 kg/día\n`;
           }
      }

      if (shareOptions.health) {
          const lastVax = vaccinations[0];
          text += `\n💉 *SANIDAD*\nÚltima Vacuna: ${lastVax?.name || 'N/A'} (${lastVax?.date})\nEstado Reprod: ${animal.reproductiveStatus === 'Pregnant' ? 'Preñada' : 'Abierta'}\n`;
      }

      text += `\n📲 _Generado por BovineGuard App_`;

      const shareData: any = {
          title: `Ficha ${animal.tag}`,
          text: text,
      };

      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              navigator.clipboard.writeText(text);
              alert('Datos copiados al portapapeles');
          }
      } catch (err) {
          console.log('Error sharing', err);
      }
      setShowShareModal(false);
  };

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
      { id: 1, date: '12 Oct, 2023', weight: animal.weight, change: '+12 kg', type: 'gain', event: 'Pesaje Rutina' },
      { id: 2, date: '12 Sep, 2023', weight: animal.weight - 12, change: '+8 kg', type: 'gain', event: 'Pesaje Mensual' },
      { id: 3, date: '12 Ago, 2023', weight: animal.weight - 20, change: '-2 kg', type: 'loss', event: 'Post-Enfermedad' },
      { id: 4, date: '12 Jul, 2023', weight: animal.weight - 18, change: '+15 kg', type: 'gain', event: 'Pesaje Mensual' },
  ];

  // Mock Data: Weight Chart
  const weightChartData = [
      { month: 'Ene', val: animal.weight - 70 },
      { month: 'Feb', val: animal.weight - 55 },
      { month: 'Mar', val: animal.weight - 40 },
      { month: 'Abr', val: animal.weight - 28 },
      { month: 'May', val: animal.weight - 15 },
      { month: 'Jun', val: animal.weight },
  ];

  const tabs = {
      'General': 'General',
      'Production': 'Producción',
      'Health': 'Sanidad',
      'Reproduction': 'Reproducción'
  }

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

  const navigateToWeight = () => {
      setProductionType('Weight');
      setActiveTab('Production');
  };

  return (
    <div className="bg-background-dark min-h-screen text-white font-display flex flex-col relative">
      {/* Parallax Header Image */}
      <div className="relative w-full h-80 shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${animal.imageUrl}")` }}></div>
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
            <button 
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 text-white cursor-pointer transition-colors active:scale-95"
            >
                <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm mb-2">
                <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${animal.status === 'Active' ? 'bg-primary' : 'bg-red-500'}`}></span>
                <span className="text-xs font-bold text-primary tracking-wide uppercase">
                    {animal.status === 'Active' ? 'Activo' : animal.status} - {animal.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-1">{animal.tag}</h1>
              <p className="text-gray-300 text-lg font-medium">#{animal.tag.split('-')[0]} • {animal.breed}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold text-white">{animal.weight} <span className="text-sm font-normal text-gray-400">kg</span></span>
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
        {/* ... (Existing Tab Content Logic remains the same, code omitted for brevity but preserved) ... */}
        {/* ==================== GENERAL TAB ==================== */}
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
                    <p className="text-xl font-bold">{animal.age}</p>
                    <p className="text-gray-500 text-[10px]">Registrada</p>
                </div>
                <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex flex-col justify-center h-24">
                     <div className="flex items-center gap-2 mb-1">
                        <Weight className="text-primary" size={18} />
                        <span className="text-xs text-gray-400">Último Peso</span>
                    </div>
                    <p className="text-xl font-bold">{animal.weight} kg</p>
                    <p className="text-gray-500 text-[10px]">{animal.lastWeighingDate}</p>
                </div>
            </div>

            {/* Milk Summary */}
            {animal.category === 'Cow' && (
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
            )}

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
          </div>
        )}
        
        {/* ==================== PRODUCTION TAB ==================== */}
        {activeTab === 'Production' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               {/* Milk/Weight Switcher */}
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

              {productionType === 'Milk' && (
                  <div className="space-y-4 animate-in fade-in">
                      <button 
                        onClick={() => navigate(`/add-production/${id}`)}
                        className="w-full bg-primary hover:bg-primary-dark text-background-dark py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        <Plus size={24} />
                        <span className="flex items-center gap-1">Registrar <Droplets size={18} fill="currentColor" /></span>
                    </button>
                    {/* ... (Existing Milk Chart & History) ... */}
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
                  </div>
              )}

              {productionType === 'Weight' && (
                  <div className="space-y-6 animate-in fade-in">
                       {/* Weight Header Card */}
                    <div className="bg-surface-dark rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mb-1">Peso Actual</p>
                                <div className="flex items-baseline gap-1">
                                    <h2 className="text-5xl font-extrabold text-white">{animal.weight}</h2>
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
                    </div>
                     {/* ... (Existing Weight Chart & History) ... */}
                  </div>
              )}
           </div>
        )}

        {/* ==================== HEALTH TAB ==================== */}
        {activeTab === 'Health' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
                 {/* ... (Existing Health lists) ... */}
                 
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
        
        {/* ==================== REPRODUCTION TAB ==================== */}
        {activeTab === 'Reproduction' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <button 
                onClick={() => navigate(`/add-reproduction/${id}`)}
                className="w-full bg-surface-dark hover:bg-white/5 text-purple-400 border border-purple-500/30 hover:border-purple-500 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                  <Plus size={20} />
                  <span className="flex items-center gap-1">Evento Reproductivo <Dna size={16} /></span>
              </button>
              {/* ... (Existing Reproduction Cards) ... */}
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
                 </div>
              </div>
           </div>
        )}

      </div>

      {/* --- CUSTOM SHARE MODAL --- */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#18281a] w-full max-w-xs rounded-3xl border border-white/10 p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                    <X size={20}/>
                </button>
                
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Share2 size={20} />
                    <h3 className="font-bold text-lg text-white">Compartir Perfil</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6">Selecciona los datos a compartir:</p>

                <div className="space-y-4 mb-8">
                    <ToggleRow label="Datos Generales" checked={shareOptions.general} onChange={v => setShareOptions({...shareOptions, general: v})} />
                    <ToggleRow label="Genealogía" checked={shareOptions.genealogy} onChange={v => setShareOptions({...shareOptions, genealogy: v})} />
                    <ToggleRow label="Producción" checked={shareOptions.production} onChange={v => setShareOptions({...shareOptions, production: v})} />
                    <ToggleRow label="Historial Sanitario" checked={shareOptions.health} onChange={v => setShareOptions({...shareOptions, health: v})} />
                </div>

                <button 
                    onClick={executeShare} 
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(17,212,33,0.3)]"
                >
                    <Share2 size={18} />
                    Compartir Datos Seleccionados
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

// Helper Component for Share Modal
const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-200">{label}</span>
        <div 
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-gray-700'}`}
        >
            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-transform ${checked ? 'right-1' : 'left-1'}`}></div>
        </div>
    </div>
);

export default AnimalDetail;