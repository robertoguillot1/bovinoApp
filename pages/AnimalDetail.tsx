
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, TrendingUp, Cake, Weight, Edit2, Plus, Droplets, Syringe, Bell, ChevronRight, BriefcaseMedical, CheckCircle2, List, Calendar, Baby, Dna, Scale, TrendingDown, X, Image as ImageIcon, Loader2, AlertCircle, Clock } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { allBovines } from '../mockData';
import html2canvas from 'html2canvas';

const AnimalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('General');
  
  // Reference for Screenshot
  const printRef = useRef<HTMLDivElement>(null);
  
  // Find the animal based on ID
  const animal = allBovines.find(b => b.id === id);

  // State for Sub-tabs
  const [healthSubTab, setHealthSubTab] = useState<'Vaccination' | 'Treatments'>('Vaccination');
  const [productionType, setProductionType] = useState<'Milk' | 'Weight'>('Milk');

  // --- SHARE MODAL STATE ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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

  // --- MOCK DATA ---
  const pedigree = {
      father: { name: 'Thunderbolt', tag: '#9921', breed: animal.breed, img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop' },
      mother: { name: 'Bessie', tag: '#1029', breed: animal.breed, img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=100&h=100' },
  };

  // Charts Data
  const milkData = [
    { day: '0', val: 0 }, { day: '30', val: 20 }, { day: '60', val: 28 },
    { day: '90', val: 32 }, { day: '120', val: 30 }, { day: '150', val: 26 },
    { day: '180', val: 22 }, { day: '210', val: 18 }, { day: '270', val: 12 },
  ];

  const weightData = [
      { month: 'Ene', val: 380 }, { month: 'Mar', val: 405 }, { month: 'May', val: 422 },
      { month: 'Jul', val: 435 }, { month: 'Sep', val: 442 }, { month: 'Nov', val: 450 }
  ];

  // Lists Data
  const milkHistory = [
      { date: 'Hoy, 06:30 AM', amount: 12.5, shift: 'AM' },
      { date: 'Ayer, 04:15 PM', amount: 11.2, shift: 'PM' },
      { date: 'Ayer, 06:30 AM', amount: 12.8, shift: 'AM' },
      { date: '12 Oct, 04:20 PM', amount: 10.9, shift: 'PM' },
  ];

  const weightHistory = [
      { date: '15 Nov 2023', weight: 450, gain: '+8kg', type: 'Rutina' },
      { date: '15 Sep 2023', weight: 442, gain: '+7kg', type: 'Entrada' },
      { date: '15 Jul 2023', weight: 435, gain: '+13kg', type: 'Rutina' },
  ];

  const healthRecords = [
      { id: 1, type: 'Vaccine', title: 'Fiebre Aftosa (Refuerzo)', date: '12 Oct 2023', dose: '2ml IM', vet: 'Dr. Santos', status: 'Done' },
      { id: 2, type: 'Treatment', title: 'Mastitis Leve', date: '05 Ago 2023', dose: 'Antibiótico 3 días', vet: 'Dr. Santos', status: 'Resolved' },
      { id: 3, type: 'Checkup', title: 'Palpación', date: '15 Ene 2023', result: 'Preñada (4 meses)', vet: 'Dra. Ruiz', status: 'Done' },
  ];

  const reproEvents = [
      { id: 1, date: '10 Nov 2023', type: 'Inseminación', detail: 'Toro: Zeus (Angus)', success: null },
      { id: 2, date: '15 Ene 2023', type: 'Parto', detail: 'Cría Macho (Vivo)', success: true },
      { id: 3, date: '01 Abr 2022', type: 'Inseminación', detail: 'Toro: Titan', success: true },
  ];

  // --- SHARE FUNCTIONALITY (TEXT) ---
  const executeShareText = async () => {
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
          const lastVax = healthRecords.find(r => r.type === 'Vaccine');
          text += `\n💉 *SANIDAD*\nÚltima Vacuna: ${lastVax?.title || 'N/A'} (${lastVax?.date})\nEstado Reprod: ${animal.reproductiveStatus === 'Pregnant' ? 'Preñada' : 'Abierta'}\n`;
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
          console.log('Error sharing text', err);
      }
      setShowShareModal(false);
  };

  // --- SHARE FUNCTIONALITY (IMAGE) ---
  const executeShareImage = async () => {
      if (!printRef.current) return;
      setIsGeneratingImage(true);
      setShowShareModal(false); // Hide modal temporarily

      // Wait a moment for modal to disappear from DOM visually
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
          const canvas = await html2canvas(printRef.current, {
              useCORS: true, // Important for external images
              scale: 2, // Improve quality
              backgroundColor: '#102212', // Force background color
              ignoreElements: (element) => {
                  // Ignore elements with specific class if needed, e.g., the share button itself if it was visible
                  return element.classList.contains('no-print'); 
              }
          });

          canvas.toBlob(async (blob) => {
              if (!blob) {
                  setIsGeneratingImage(false);
                  return;
              }

              const file = new File([blob], `BovineGuard_${animal.tag}.png`, { type: 'image/png' });

              // Check if browser supports sharing files
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                  try {
                      await navigator.share({
                          files: [file],
                          title: `Perfil ${animal.tag}`,
                          text: `Mira el perfil de ${animal.tag} en BovineGuard.`
                      });
                  } catch (shareError) {
                      console.error('Error native sharing', shareError);
                  }
              } else {
                  // Fallback: Download image
                  const link = document.createElement('a');
                  link.download = `BovineGuard_${animal.tag}.png`;
                  link.href = canvas.toDataURL();
                  link.click();
                  alert('Imagen guardada en descargas (tu navegador no soporta compartir imágenes directo).');
              }
              setIsGeneratingImage(false);
          }, 'image/png');

      } catch (error) {
          console.error("Screenshot error:", error);
          alert("Error al generar la imagen.");
          setIsGeneratingImage(false);
          setShowShareModal(true); // Re-show modal on error
      }
  };

  const tabs = {
      'General': 'General',
      'Production': 'Producción',
      'Health': 'Sanidad',
      'Reproduction': 'Reproducción'
  }

  return (
    <div className="bg-background-dark min-h-screen text-white font-display flex flex-col relative" ref={printRef}>
      {/* Parallax Header Image */}
      <div className="relative w-full h-80 shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${animal.imageUrl}")` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark"></div>
        
        {/* Nav - Hide during print */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-50 no-print">
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
      <div className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 w-full overflow-x-auto no-scrollbar no-print">
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
        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === 'General' && (
          <div className="space-y-6">
            
            {/* 1. ALERTS & STATUS SECTION */}
            {(animal.healthStatus === 'Sick' || animal.reproductiveStatus === 'Pregnant' || animal.isLactating) && (
                <div className="grid grid-cols-1 gap-3">
                    {animal.healthStatus === 'Sick' && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                            <div className="bg-red-500/20 p-2 rounded-full text-red-500 animate-pulse">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-red-400 font-bold text-sm">Alerta Sanitaria Activa</h4>
                                <p className="text-xs text-gray-400 mt-1">Este animal tiene un tratamiento en curso. Revisar pestaña Sanidad.</p>
                            </div>
                        </div>
                    )}
                    {animal.reproductiveStatus === 'Pregnant' && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-start gap-3">
                            <div className="bg-purple-500/20 p-2 rounded-full text-purple-400">
                                <Baby size={20} />
                            </div>
                            <div>
                                <h4 className="text-purple-400 font-bold text-sm">Gestación Confirmada</h4>
                                <p className="text-xs text-gray-400 mt-1">Parto estimado: 24 Nov 2024. Faltan 45 días.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. Quick Stats Row */}
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

            {/* 3. Recent Activity (Consolidated Notifications) */}
            <div>
                <h3 className="text-lg font-bold mb-3">Actividad Reciente</h3>
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-1">
                    {[
                        { icon: Syringe, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Vacunación Aftosa', date: '12 Oct', desc: 'Dosis completa aplicada' },
                        { icon: Scale, color: 'text-accent-amber', bg: 'bg-accent-amber/10', title: 'Pesaje de Rutina', date: '10 Oct', desc: 'Ganancia +4.5kg' },
                        { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', title: 'Revisión General', date: '01 Oct', desc: 'Estado corporal 4/5' },
                    ].map((event, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${event.bg} ${event.color}`}>
                                <event.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-bold text-white">{event.title}</h4>
                                    <span className="text-[10px] text-gray-500">{event.date}</span>
                                </div>
                                <p className="text-xs text-gray-400">{event.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 4. Genealogy Section */}
            <div>
                <div className="flex items-center justify-between px-1 mb-2">
                    <h2 className="text-lg font-bold">Árbol Genealógico</h2>
                    <button 
                        onClick={() => navigate(`/genealogy/${id}`)}
                        className="text-primary text-xs font-bold tracking-wider uppercase hover:underline no-print"
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
                                <img src={pedigree.father.img} className="w-full h-full rounded-full object-cover filter brightness-90" crossOrigin="anonymous" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Padre</span>
                            <h3 className="text-white text-sm font-bold">{pedigree.father.name}</h3>
                            <p className="text-gray-500 text-[10px]">{pedigree.father.tag}</p>
                        </div>

                        {/* Mother */}
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-pink-500/20 mb-2 bg-surface-darker">
                                <img src={pedigree.mother.img} className="w-full h-full rounded-full object-cover filter brightness-90" crossOrigin="anonymous" />
                            </div>
                            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-0.5">Madre</span>
                            <h3 className="text-white text-sm font-bold">{pedigree.mother.name}</h3>
                            <p className="text-gray-500 text-[10px]">{pedigree.mother.tag}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Milk Summary (If Cow) */}
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
                    </div>
                </div>
            )}
          </div>
        )}
        
        {/* ==================== PRODUCTION TAB ==================== */}
        {activeTab === 'Production' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Toggle */}
              <div className="bg-surface-dark border border-white/10 p-1 rounded-xl flex">
                 <button onClick={() => setProductionType('Milk')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${productionType === 'Milk' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Leche</button>
                 <button onClick={() => setProductionType('Weight')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${productionType === 'Weight' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Peso</button>
              </div>

              {productionType === 'Milk' ? (
                  <>
                    <div className="bg-surface-dark rounded-xl border border-white/5 p-4 shadow-sm relative">
                        <h3 className="text-sm font-bold text-gray-300 mb-2">Histórico de Lactancia</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={milkData}>
                                    <defs>
                                        <linearGradient id="colorMilk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#11d421" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#11d421" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#18281a', border: '1px solid #ffffff20', borderRadius: '8px'}}
                                        itemStyle={{color: '#fff'}}
                                        labelStyle={{display: 'none'}}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#11d421" strokeWidth={3} fill="url(#colorMilk)" activeDot={{ r: 6, fill: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-300">Registros Recientes</h3>
                        {milkHistory.map((record, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-dark border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{record.amount} Litros</p>
                                        <p className="text-[10px] text-gray-500">{record.date}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-surface-darker px-2 py-1 rounded">{record.shift}</span>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => navigate(`/add-production/${id}`)}
                        className="fixed bottom-24 right-5 bg-primary text-black font-bold h-14 px-6 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-transform z-30"
                    >
                        <Plus size={24} /> Registrar Ordeño
                    </button>
                  </>
              ) : (
                  <>
                    <div className="bg-surface-dark rounded-xl border border-white/5 p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-bold text-gray-300">Curva de Crecimiento</h3>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">+0.8 kg/día</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#18281a', border: '1px solid #ffffff20', borderRadius: '8px'}}
                                        itemStyle={{color: '#fff'}}
                                        labelStyle={{display: 'none'}}
                                    />
                                    <Line type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={3} dot={{r:4, fill:'#f59e0b'}} activeDot={{ r: 6, fill: '#fff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-300">Historial de Pesaje</h3>
                        {weightHistory.map((record, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-dark border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center text-accent-amber">
                                        <Scale size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{record.weight} kg</p>
                                        <p className="text-[10px] text-gray-500">{record.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-green-400">{record.gain}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">{record.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => navigate(`/add-weight/${id}`)}
                        className="fixed bottom-24 right-5 bg-accent-amber text-black font-bold h-14 px-6 rounded-full shadow-lg shadow-accent-amber/20 flex items-center gap-2 active:scale-95 transition-transform z-30"
                    >
                        <Plus size={24} /> Registrar Peso
                    </button>
                  </>
              )}
           </div>
        )}

        {/* ==================== HEALTH TAB ==================== */}
        {activeTab === 'Health' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-2 mb-2">
                     <h3 className="text-lg font-bold">Ficha Sanitaria</h3>
                     <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Estado: Saludable</span>
                 </div>

                 <div className="relative pl-4 space-y-6 border-l-2 border-white/10 ml-2">
                     {healthRecords.map((record, index) => (
                         <div key={index} className="relative pl-6">
                             {/* Timeline Dot */}
                             <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-background-dark ${
                                 record.type === 'Vaccine' ? 'bg-blue-500' : 
                                 record.type === 'Treatment' ? 'bg-red-500' : 'bg-purple-500'
                             }`}></div>
                             
                             <div className="bg-surface-dark border border-white/5 p-4 rounded-xl hover:border-white/20 transition-colors">
                                 <div className="flex justify-between items-start mb-1">
                                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                         record.type === 'Vaccine' ? 'bg-blue-500/10 text-blue-400' : 
                                         record.type === 'Treatment' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
                                     }`}>{record.type}</span>
                                     <span className="text-xs text-gray-500">{record.date}</span>
                                 </div>
                                 <h4 className="text-white font-bold text-base mb-1">{record.title}</h4>
                                 <p className="text-xs text-gray-400 mb-2">
                                     {record.type === 'Checkup' ? `Resultado: ${record.result}` : `Dosis: ${record.dose}`}
                                 </p>
                                 <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                     <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">
                                         DR
                                     </div>
                                     <span className="text-[10px] text-gray-400">{record.vet}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>

                 <button 
                    onClick={() => navigate(`/add-health/${id}`)}
                    className="fixed bottom-24 right-5 bg-blue-500 text-white font-bold h-14 px-6 rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-transform z-30"
                >
                    <Plus size={24} /> Evento Sanitario
                </button>
             </div>
        )}

        {/* ==================== REPRODUCTION TAB ==================== */}
        {activeTab === 'Reproduction' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Estado Actual</p>
                      <p className="text-xl font-bold text-white text-purple-400 flex items-center gap-2">
                          <CheckCircle2 size={20} /> Preñada
                      </p>
                  </div>
                  <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase">Parto Estimado</p>
                      <p className="text-lg font-bold text-white">24 Nov 2024</p>
                  </div>
              </div>

              <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-300">Historial de Eventos</h3>
                  {reproEvents.map((event, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-surface-dark border border-white/5 rounded-xl items-start">
                          <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              event.type === 'Parto' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-400'
                          }`}>
                              {event.type === 'Parto' ? <Baby size={20} /> : <Dna size={20} />}
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between">
                                  <h4 className="font-bold text-white text-sm">{event.type}</h4>
                                  <span className="text-[10px] text-gray-500">{event.date}</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{event.detail}</p>
                          </div>
                      </div>
                  ))}
              </div>

              <button 
                    onClick={() => navigate(`/add-reproduction/${id}`)}
                    className="fixed bottom-24 right-5 bg-purple-500 text-white font-bold h-14 px-6 rounded-full shadow-lg shadow-purple-500/20 flex items-center gap-2 active:scale-95 transition-transform z-30"
                >
                    <Plus size={24} /> Evento Reprod.
              </button>
           </div>
        )}

      </div>

      {/* --- CUSTOM SHARE MODAL --- */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 no-print">
            <div className="bg-[#18281a] w-full max-w-xs rounded-3xl border border-white/10 p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                    <X size={20}/>
                </button>
                
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Share2 size={20} />
                    <h3 className="font-bold text-lg text-white">Compartir Perfil</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6">Selecciona el formato:</p>

                {/* Screenshot Button */}
                <button 
                    onClick={executeShareImage} 
                    className="w-full py-4 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                    <ImageIcon size={20} />
                    Compartir como Imagen
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase">O Texto Plano</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="space-y-4 mb-6 mt-2">
                    <ToggleRow label="Datos Generales" checked={shareOptions.general} onChange={v => setShareOptions({...shareOptions, general: v})} />
                    <ToggleRow label="Genealogía" checked={shareOptions.genealogy} onChange={v => setShareOptions({...shareOptions, genealogy: v})} />
                    <ToggleRow label="Producción" checked={shareOptions.production} onChange={v => setShareOptions({...shareOptions, production: v})} />
                </div>

                <button 
                    onClick={executeShareText} 
                    className="w-full py-3 bg-surface-dark border border-primary/50 text-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-primary/10"
                >
                    <Share2 size={18} />
                    Copiar / Enviar Texto
                </button>
            </div>
        </div>
      )}

      {/* Loading Overlay for Screenshot */}
      {isGeneratingImage && (
          <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
              <Loader2 size={48} className="text-primary animate-spin mb-4" />
              <p className="text-white font-bold animate-pulse">Generando Imagen...</p>
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
