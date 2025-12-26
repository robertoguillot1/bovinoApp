
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, User, Tag, ChevronDown,
  ShieldCheck, Camera, Image, ArrowRight, Timer, Users,
  RefreshCw, MapPin, Info, Search, CheckCircle2, Circle,
  History, FileText, Plus, Filter, ArrowUpRight, ArrowRightLeft, X,
  Truck, FileCheck, ExternalLink, Paperclip, Car, Warehouse,
  Receipt, StickyNote
} from 'lucide-react';
import { farmsData } from '../mockData';

const Transfers: React.FC = () => {
  const navigate = useNavigate();
  // Step 0: History, 1: Scope, 2: Selection, 3: Confirmation
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  // Search State for Step 0 (History)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search State for Step 2 (Selection)
  const [selectionQuery, setSelectionQuery] = useState('');

  // State for Viewing Detail
  const [viewingTransfer, setViewingTransfer] = useState<any | null>(null);
  const [showDocPreview, setShowDocPreview] = useState(false); 

  // State for Wizard
  const [scope, setScope] = useState<'Individual' | 'Lote'>('Individual');
  const [movementType, setMovementType] = useState<'Transferencia' | 'Venta'>('Venta');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Sale' | 'Transfer'>('All');

  // Form States
  const [price, setPrice] = useState('');
  const [destinationText, setDestinationText] = useState(''); // For Sales
  const [destinationFarm, setDestinationFarm] = useState(''); // For Internal Transfers
  
  // Logistics States
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  const [guideImage, setGuideImage] = useState<string | null>(null);

  // Focus effect for search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Mock Data for History
  const historyData = [
      { id: 'TR-1029', date: '25 Oct 2023', type: 'Sale', quantity: 5, detail: 'Comprador: Carnes S.A.', amount: '$ 12.5M', status: 'Completed', origin: 'Hacienda La Esperanza', dest: 'Planta Carnes S.A.', driver: 'Carlos Ruiz', plate: 'GHT-882' },
      { id: 'TR-1028', date: '20 Oct 2023', type: 'Transfer', quantity: 12, detail: 'A: Finca El Roble', status: 'Completed', origin: 'Hacienda La Esperanza', dest: 'Finca El Roble', driver: 'Transportes del Norte', plate: 'WQX-991' },
      { id: 'TR-1027', date: '15 Oct 2023', type: 'Sale', quantity: 1, detail: 'Descarte: Matadero Municipal', amount: '$ 2.1M', status: 'Completed', origin: 'Finca El Roble', dest: 'Matadero Municipal', driver: 'Juan Perez', plate: 'N/A' },
      { id: 'TR-1026', date: '10 Sep 2023', type: 'Transfer', quantity: 45, detail: 'A: Lote Engorde 2', status: 'Completed', origin: 'Potrero Cría', dest: 'Lote Engorde 2', driver: 'Interno', plate: 'N/A' },
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
      setSelectionQuery('');
      setDriver('');
      setPlate('');
      setGuideImage(null);
      setDestinationFarm('');
      setDestinationText('');
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

  const handleGuideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setGuideImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  // --- VIEW: TRANSFER DETAIL (RESTORED) ---
  if (viewingTransfer) {
      return (
          <div className="bg-background-dark text-white font-display min-h-screen flex flex-col relative animate-in slide-in-from-right-10 duration-200">
              <header className="px-4 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setViewingTransfer(null)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                          <ArrowLeft size={24} />
                      </button>
                      <div>
                          <div className="flex items-center gap-2">
                              <h1 className="text-xl font-bold leading-none">{viewingTransfer.id}</h1>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${
                                  viewingTransfer.status === 'Completed' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                              }`}>
                                  {viewingTransfer.status === 'Completed' ? 'Completado' : 'Pendiente'}
                              </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{viewingTransfer.type === 'Sale' ? 'Venta Externa' : 'Traslado Interno'}</p>
                      </div>
                  </div>
              </header>

              <main className="flex-1 overflow-y-auto p-5 pb-10 space-y-6">
                  
                  {/* Summary Card */}
                  <div className="bg-surface-dark border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Truck size={100} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                          <div>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Fecha</p>
                              <p className="text-lg font-bold text-white flex items-center gap-2">
                                  <Calendar size={16} className="text-primary"/> {viewingTransfer.date}
                              </p>
                          </div>
                          <div>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Animales</p>
                              <p className="text-lg font-bold text-white flex items-center gap-2">
                                  <Users size={16} className="text-primary"/> {viewingTransfer.quantity} Cabezas
                              </p>
                          </div>
                          {viewingTransfer.amount && (
                              <div className="col-span-2 pt-2 border-t border-white/5 mt-2">
                                  <p className="text-gray-400 text-xs font-bold uppercase mb-1">Valor Total</p>
                                  <p className="text-2xl font-bold text-green-400">{viewingTransfer.amount}</p>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                          <MapPin size={16} /> Ruta Logística
                      </h3>
                      <div className="bg-surface-dark border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-1 mt-1">
                                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                                  <div className="w-0.5 h-12 bg-white/10"></div>
                              </div>
                              <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase">Origen</p>
                                  <p className="text-white font-bold">{viewingTransfer.origin}</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-1 mt-1">
                                  <div className="w-3 h-3 rounded-full bg-accent-amber ring-4 ring-accent-amber/20"></div>
                              </div>
                              <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase">Destino</p>
                                  <p className="text-white font-bold">{viewingTransfer.dest}</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Mobilization Guide (DOCUMENT PHOTO & DRIVER INFO RESTORED) */}
                  <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                          <FileCheck size={16} /> Guía de Movilización
                      </h3>
                      
                      <div 
                          onClick={() => setShowDocPreview(true)}
                          className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] cursor-pointer bg-black active:scale-[0.98] transition-transform"
                      >
                          {/* Mock Document Image */}
                          <img 
                              src="https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              alt="Guia ICA"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                              <div className="flex justify-between items-end">
                                  <div>
                                      <p className="text-white font-bold text-sm">Guía ICA #99283-X</p>
                                      <p className="text-xs text-gray-400">Expedida: {viewingTransfer.date}</p>
                                  </div>
                                  <button className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 text-white">
                                      <ArrowUpRight size={20} />
                                  </button>
                              </div>
                          </div>
                          
                          {/* Zoom Hint */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Search size={24} />
                          </div>
                      </div>
                      
                      <div className="flex gap-2">
                          <div className="flex-1 bg-surface-dark p-3 rounded-xl border border-white/5 flex items-center gap-3">
                              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                                  <User size={18} />
                              </div>
                              <div>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold">Conductor</p>
                                  <p className="text-sm font-bold text-white truncate">{viewingTransfer.driver}</p>
                              </div>
                          </div>
                          <div className="flex-1 bg-surface-dark p-3 rounded-xl border border-white/5 flex items-center gap-3">
                              <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
                                  <Truck size={18} />
                              </div>
                              <div>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold">Placa</p>
                                  <p className="text-sm font-bold text-white uppercase">{viewingTransfer.plate}</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Animal List Preview */}
                  <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                          <Tag size={16} /> Animales ({viewingTransfer.quantity})
                      </h3>
                      {/* Simulating list based on Quantity */}
                      {[...Array(Math.min(viewingTransfer.quantity, 4))].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-surface-dark border border-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-surface-darker flex items-center justify-center text-xs font-bold text-gray-400">
                                      {i + 1}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-white">Bovino #{Math.floor(Math.random() * 9000) + 1000}</p>
                                      <p className="text-[10px] text-gray-500">Holstein • 450kg</p>
                                  </div>
                              </div>
                              <ArrowRight size={16} className="text-gray-600" />
                          </div>
                      ))}
                      {viewingTransfer.quantity > 4 && (
                          <button className="w-full py-3 text-sm text-primary font-bold bg-surface-dark rounded-xl hover:bg-white/5 transition-colors">
                              Ver los {viewingTransfer.quantity - 4} restantes
                          </button>
                      )}
                  </div>

              </main>

              {/* Full Screen Image Preview Modal */}
              {showDocPreview && (
                  <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowDocPreview(false)}>
                      <button 
                          onClick={() => setShowDocPreview(false)}
                          className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-50 transition-colors"
                      >
                          <X size={28} />
                      </button>
                      
                      <img 
                          src="https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop" 
                          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                          alt="Document Full Screen"
                          onClick={(e) => e.stopPropagation()} // Prevent close on image click
                      />

                      <div className="absolute bottom-0 inset-x-0 p-8 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                          <h3 className="text-2xl font-bold text-white mb-1">Guía de Movilización ICA</h3>
                          <p className="text-gray-300">Documento legal asociado al traslado {viewingTransfer.id}</p>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- STEP 0: HISTORY VIEW ---
  if (step === 0) {
      const filteredHistory = historyData.filter(item => {
          // Tab Filter
          if (historyFilter !== 'All' && item.type !== historyFilter) return false;
          
          // Search Query Filter
          if (searchQuery) {
              const query = searchQuery.toLowerCase();
              return (
                  item.id.toLowerCase().includes(query) ||
                  item.detail.toLowerCase().includes(query) ||
                  item.date.toLowerCase().includes(query)
              );
          }
          return true;
      });

      return (
        <div className="bg-background-dark text-white font-display min-h-screen flex flex-col relative">
            <header className="px-4 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5 h-20">
                {isSearchOpen ? (
                   // Search Bar Active
                   <div className="flex-1 flex items-center bg-white/10 rounded-xl px-3 py-1 animate-in fade-in zoom-in-95 duration-200 h-10 mt-2">
                       <Search size={18} className="text-gray-400 mr-2 shrink-0"/>
                       <input
                           ref={searchInputRef}
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Buscar ID, detalle, fecha..."
                           className="bg-transparent border-none outline-none text-white w-full text-base placeholder-gray-400 h-9"
                       />
                       {searchQuery && (
                           <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-white mr-1">
                               <X size={14} className="bg-gray-600 rounded-full p-0.5" />
                           </button>
                       )}
                       <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-sm font-bold text-gray-400 hover:text-white whitespace-nowrap">
                           Cancelar
                       </button>
                   </div>
               ) : (
                   // Default Header
                   <>
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 mt-2">
                            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold leading-none">Traslados</h1>
                                <p className="text-xs text-gray-400 mt-1">Historial de Movimientos</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 mt-2 animate-in fade-in slide-in-from-right-2"
                        >
                            <Search size={24} />
                        </button>
                   </>
               )}
            </header>

            {/* Filter Tabs */}
            {!isSearchOpen && (
                <div className="p-4 pb-2 animate-in fade-in slide-in-from-top-2">
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
            )}

            <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <Search size={32} className="mx-auto mb-2 text-gray-600"/>
                        <p className="text-sm font-bold">No se encontraron movimientos</p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setViewingTransfer(item)}
                            className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors cursor-pointer active:scale-[0.99] group"
                        >
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
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Users size={12}/> {item.quantity} Animales</p>
                                </div>
                                {item.amount ? (
                                    <span className="text-lg font-bold text-white">{item.amount}</span>
                                ) : (
                                    <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                        Ver Detalle <ArrowRight size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* FAB to Start Wizard */}
            {!isSearchOpen && (
                <button
                    onClick={() => setStep(1)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-black rounded-full shadow-[0_0_20px_rgba(17,212,33,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
                >
                    <Plus size={28} />
                </button>
            )}
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
    const filteredAnimals = availableAnimals.filter(a => 
        a.tag.toLowerCase().includes(selectionQuery.toLowerCase()) || 
        a.breed.toLowerCase().includes(selectionQuery.toLowerCase())
    );

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
                 {/* Search Bar (Active) */}
                 <div className="relative mb-2">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        value={selectionQuery}
                        onChange={(e) => setSelectionQuery(e.target.value)}
                        placeholder="Buscar por ID o Raza..."
                        className="w-full bg-[#18281a] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-white placeholder-gray-600 focus:border-[#11d421] outline-none transition-all"
                        autoFocus
                    />
                    {selectionQuery && (
                        <button onClick={() => setSelectionQuery('')} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {filteredAnimals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No se encontraron animales con ese criterio.
                    </div>
                ) : (
                    filteredAnimals.map(animal => {
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
                    })
                )}
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

  // --- STEP 3: CONFIRMATION & DETAILS (BEAUTIFIED) ---
  if (step === 3) {
      return (
        <div className="bg-[#102212] text-white font-display min-h-screen flex flex-col">
            
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b border-white/5">
                <button onClick={() => setStep(2)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Detalles del Movimiento</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
                
                {/* 1. Summary Hero Card (Manifest Style) */}
                <div className="bg-surface-dark border border-white/10 rounded-2xl relative overflow-hidden shadow-lg">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                        <Receipt size={140} />
                    </div>
                    
                    <div className="p-5 relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Operación</span>
                                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                                    {movementType === 'Venta' ? <DollarSign className="text-primary" size={24}/> : <RefreshCw className="text-blue-400" size={24}/>}
                                    {movementType}
                                </h2>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-xl text-right border border-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                                <span className="text-xl font-bold text-white">{selectedIds.length} <span className="text-sm font-normal text-gray-500">Cabezas</span></span>
                            </div>
                        </div>

                        {/* Price Input Highlighting (Only for Sales) */}
                        {movementType === 'Venta' && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <label className="text-xs font-bold text-accent-amber uppercase tracking-wide block mb-2">Valor Total Negociado</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-500">$</span>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={handlePriceChange}
                                        placeholder="0"
                                        className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-600 outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Destination Card */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Destino & Logística</h3>
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-1">
                        
                        {/* Destination Input */}
                        <div className="p-4 border-b border-white/5">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-wide block mb-2 flex items-center gap-1">
                                {movementType === 'Venta' ? <User size={12}/> : <Warehouse size={12}/>}
                                {movementType === 'Venta' ? 'Comprador / Cliente' : 'Finca de Destino'}
                            </label>
                            
                            {movementType === 'Venta' ? (
                                <input
                                    type="text"
                                    value={destinationText}
                                    onChange={(e) => setDestinationText(e.target.value)}
                                    placeholder="Nombre del comprador..."
                                    className="w-full bg-surface-darker/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary outline-none transition-all font-medium"
                                />
                            ) : (
                                <div className="relative">
                                    <select
                                        value={destinationFarm}
                                        onChange={(e) => setDestinationFarm(e.target.value)}
                                        className="w-full bg-surface-darker/50 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white font-medium appearance-none focus:border-primary outline-none cursor-pointer"
                                    >
                                        <option value="" disabled className="text-gray-500">Seleccionar ubicación...</option>
                                        {farmsData.map(farm => (
                                            <option key={farm.id} value={farm.id} className="bg-surface-dark text-white">
                                                {farm.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                                </div>
                            )}
                        </div>

                        {/* Transport Inputs */}
                        <div className="p-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-2">Conductor</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={driver}
                                        onChange={(e) => setDriver(e.target.value)}
                                        placeholder="Nombre"
                                        className="w-full bg-surface-darker/50 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-gray-600 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-2">Vehículo</label>
                                <div className="relative">
                                    <Car size={16} className="absolute left-3 top-3.5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                        placeholder="Placa"
                                        className="w-full bg-surface-darker/50 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-gray-600 focus:border-primary outline-none uppercase font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Documentation Upload */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Documentación Legal</h3>
                    <div className={`relative w-full aspect-[3/1] rounded-2xl border-2 border-dashed transition-all group overflow-hidden ${guideImage ? 'border-primary/50 bg-black' : 'border-white/10 bg-surface-dark hover:border-white/20'}`}>
                        {guideImage ? (
                            <>
                                <img src={guideImage} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center gap-2">
                                    <span className="text-primary font-bold text-sm bg-black/50 px-3 py-1 rounded-full border border-primary/30 flex items-center gap-2">
                                        <CheckCircle2 size={16}/> Guía Cargada
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setGuideImage(null)}
                                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-full bg-surface-darker flex items-center justify-center mb-2 text-primary">
                                    <Camera size={20} />
                                </div>
                                <span className="text-xs font-bold uppercase">Foto Guía de Movilización</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleGuideUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* 4. Notes */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                    <StickyNote size={20} className="text-gray-500 mt-1 shrink-0" />
                    <textarea
                        rows={2}
                        placeholder="Observaciones adicionales (ej. condiciones de pago, estado de salud...)"
                        className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none resize-none"
                    />
                </div>

            </main>

            {/* Floating Confirm Button */}
            <div className="p-6 border-t border-white/5 bg-background-dark/95 backdrop-blur-lg z-30">
                <button
                    onClick={handleFinalConfirm}
                    className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(17,212,33,0.3)]"
                >
                    <CheckCircle2 size={24} /> 
                    Confirmar {movementType}
                </button>
            </div>
        </div>
      );
  }

  return null;
};

export default Transfers;
