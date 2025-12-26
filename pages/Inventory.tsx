
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Bell, CheckCircle2, MoreVertical, Heart, Droplets, Stethoscope, Plus, ArrowLeft, Layers, LayoutGrid, Users, MapPin, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Lot, Bovine } from '../types';
import { allBovines, farmsData, mockNotifications } from '../mockData';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const farmId = searchParams.get('farmId');
  
  const [viewMode, setViewMode] = useState<'Animals' | 'Lots'>('Animals');
  const [filter, setFilter] = useState('Todos');

  // Notification State
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- DATA LOADING FROM LOCALSTORAGE ---
  const [inventory, setInventory] = useState<Bovine[]>([]);
  const [farms, setFarms] = useState<any[]>([]);

  useEffect(() => {
      // 1. Load Inventory
      const savedBovines = localStorage.getItem('bovine_inventory');
      if (savedBovines) {
          setInventory(JSON.parse(savedBovines));
      } else {
          // Initialize with mocks if empty and save
          localStorage.setItem('bovine_inventory', JSON.stringify(allBovines));
          setInventory(allBovines);
      }

      // 2. Load Farms (to get correct name)
      const savedFarms = localStorage.getItem('bovine_farms');
      if (savedFarms) {
          setFarms(JSON.parse(savedFarms));
      } else {
          setFarms(farmsData);
      }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setNotifications(notifications.filter(n => n.id !== id));
  };

  // Dynamic Farm Name Lookup
  const currentFarm = farmId ? farms.find(f => f.id === farmId) : null;
  const currentFarmName = currentFarm ? currentFarm.name : 'Todas las Fincas';

  // Filter animals based on farmId and Filter Pill
  const filteredBovines = inventory.filter(b => {
      // 1. Farm Filter
      if (farmId && b.farmId !== farmId) return false;
      
      // 2. Status/Category Filter
      if (filter === 'Todos') return true;
      if (filter === 'Activos') return b.status === 'Active';
      if (filter === 'Vendidos') return b.status === 'Sold';
      if (filter === 'Vacas') return b.category === 'Vaca' || b.category === 'Cow';
      if (filter === 'Novillas') return b.category === 'Novilla' || b.category === 'Heifer';
      if (filter === 'Terneros') return b.category === 'Ternero' || b.category === 'Calf';
      
      return true;
  });

  // Mock Lots (Could also be persisted in future)
  const lots: Lot[] = [
      { id: 'L1', name: 'Lote Ordeño #1', type: 'Production', animalCount: 45, avgWeight: 420, location: 'Potrero Norte' },
      { id: 'L2', name: 'Destete Nov 2023', type: 'Weaning', animalCount: 12, avgWeight: 180, location: 'Corral 3' },
      { id: 'L3', name: 'Engorde Intensivo', type: 'Fattening', animalCount: 28, avgWeight: 350, location: 'Potrero Sur' },
      { id: 'L4', name: 'Cuarentena', type: 'Quarantine', animalCount: 3, avgWeight: 400, location: 'Enfermería' },
  ];

  return (
    <div className="bg-background-dark min-h-screen text-white font-display pb-20" onClick={() => setShowNotifications(false)}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-white/10">
                <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Inventario</span>
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold leading-tight truncate max-w-[200px]">{currentFarmName}</h1>
                    <CheckCircle2 size={16} className="text-accent-amber" />
                </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/10"><Search size={20} /></button>
            
             {/* Notification Bell with Dropdown */}
            <div className="relative">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications(!showNotifications);
                    }}
                    className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-surface-dark text-white' : 'hover:bg-white/10'}`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent-amber rounded-full"></span>
                    )}
                </button>

                {/* Dropdown Menu */}
                {showNotifications && (
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-2 w-80 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-darker/50">
                            <h3 className="font-bold text-sm">Notificaciones ({unreadCount})</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-primary font-bold hover:underline">
                                    Marcar leídas
                                </button>
                            )}
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                    No tienes notificaciones
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => markAsRead(n.id)}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative ${!n.read ? 'bg-primary/5' : ''}`}
                                    >
                                        {/* Notification Item Content */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

          </div>
        </div>
        
        {/* View Switcher (Animals vs Lots) */}
        <div className="px-4 pb-3">
            <div className="bg-surface-dark border border-white/10 p-1 rounded-xl flex mb-3">
                <button 
                    onClick={() => setViewMode('Animals')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                        viewMode === 'Animals' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    <LayoutGrid size={16} /> Individual
                </button>
                <button 
                    onClick={() => setViewMode('Lots')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                        viewMode === 'Lots' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    <Layers size={16} /> Lotes / Grupos
                </button>
            </div>

            {/* Sub Filters (Only for Animals view) */}
            {viewMode === 'Animals' && (
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
                        {['Todos', 'Activos', 'Vendidos', 'Vacas', 'Novillas', 'Terneros'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`shrink-0 px-3 py-1.5 rounded-full font-medium text-xs transition-all border ${
                                filter === f 
                                ? 'bg-primary text-black border-primary' 
                                : 'bg-surface-dark text-gray-400 border-white/10 hover:bg-white/5'
                            }`}
                        >
                            {f}
                        </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        
        {/* --- ANIMALS LIST VIEW --- */}
        {viewMode === 'Animals' && (
            <>
                {filteredBovines.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-lg font-bold">No hay animales.</p>
                        <p className="text-sm">Registra un nuevo bovino o cambia el filtro.</p>
                    </div>
                ) : (
                    filteredBovines.map((animal) => (
                        <div key={animal.id} onClick={() => navigate(`/animal/${animal.id}`)} className="group relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
                            {animal.healthStatus === 'Sick' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-status-sick"></div>}
                            
                            <div className="flex p-4 gap-4 items-center">
                                <div className="relative shrink-0">
                                    <img src={animal.imageUrl} alt={animal.tag} className="h-20 w-20 rounded-full object-cover bg-gray-700" />
                                    {animal.healthStatus === 'Healthy' && (
                                    <div className="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-1">
                                            <div className="bg-primary text-black h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold">98%</div>
                                    </div> 
                                    )}
                                </div>
                                
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h3 className="text-lg font-extrabold text-white truncate">{animal.tag}</h3>
                                        <span className="text-xs font-medium text-gray-400">{animal.breed} • {animal.age}</span>
                                    </div>
                                    
                                    {/* Gender Row */}
                                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span className={animal.gender === 'Male' ? 'text-blue-400' : 'text-pink-400'}>
                                            {animal.gender === 'Male' ? '♂ Macho' : '♀ Hembra'}
                                        </span>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-gray-400">{animal.category}</span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {animal.healthStatus === 'Sick' && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-status-sick/10 px-2 py-1 text-xs font-medium text-status-sick border border-status-sick/20 animate-pulse">
                                                <Stethoscope size={12} /> Enferma
                                            </span>
                                        )}
                                        {animal.reproductiveStatus === 'Pregnant' && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-status-pregnant/10 px-2 py-1 text-xs font-medium text-status-pregnant border border-status-pregnant/20">
                                                <Heart size={12} fill="currentColor" /> Preñada
                                            </span>
                                        )}
                                        {animal.isLactating && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-status-lactating/10 px-2 py-1 text-xs font-medium text-status-lactating border border-status-lactating/20">
                                                <Droplets size={12} fill="currentColor" /> Lactancia
                                            </span>
                                        )}
                                        {animal.healthStatus === 'Healthy' && !animal.isLactating && !animal.reproductiveStatus && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
                                                Sana
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="shrink-0">
                                    <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
                                </div>
                            </div>
                            
                            <div className="flex border-t border-white/5 bg-black/20 px-4 py-2 justify-between text-xs text-gray-400">
                                <span>Peso: <strong className="text-gray-200">{animal.weight}kg</strong></span>
                                <span>Ult: <strong className="text-gray-200">{animal.lastWeighingDate}</strong></span>
                            </div>
                        </div>
                    ))
                )}
            </>
        )}

        {/* --- LOTS GRID VIEW --- */}
        {viewMode === 'Lots' && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                {lots.map((lot) => (
                    <div key={lot.id} className="bg-surface-dark border border-white/5 rounded-2xl p-5 relative overflow-hidden hover:border-primary/30 transition-colors cursor-pointer group">
                        {/* Decorative background icon */}
                        <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform">
                            <Layers size={100} />
                        </div>

                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{lot.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <MapPin size={12} /> {lot.location}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                lot.type === 'Production' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                lot.type === 'Quarantine' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-green-500/10 text-green-400 border-green-500/20'
                            }`}>
                                {lot.type === 'Production' ? 'Producción' : lot.type === 'Quarantine' ? 'Cuarentena' : 'General'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{lot.animalCount}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                    <Users size={10} /> Cabezas
                                </span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-200">{lot.avgWeight} <span className="text-xs font-normal">kg</span></span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Peso Prom.</span>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                             <span className="text-xs font-bold text-primary flex items-center gap-1">
                                Ver Animales <ArrowRight size={14} />
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* Floating Action Button (Context Aware) */}
      <button 
        onClick={() => viewMode === 'Animals' ? navigate('/register-bovine') : navigate('/create-lot')}
        className="fixed bottom-24 right-6 h-14 bg-primary hover:bg-primary-dark text-black rounded-full shadow-xl shadow-primary/30 flex items-center gap-2 pl-4 pr-5 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
        <span className="font-bold text-sm">
            {viewMode === 'Animals' ? 'Bovino' : 'Crear Lote'}
        </span>
      </button>

      <BottomNav />
    </div>
  );
};

export default Inventory;
