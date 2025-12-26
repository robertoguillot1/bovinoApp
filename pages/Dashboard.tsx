
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MoreHorizontal, Droplets, TrendingUp, Users, Plus, ArrowRight, Gauge, Bell, AlertTriangle, CheckCircle2, Info, X, BrainCircuit, ClipboardList, Disc } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { farmsData, allBovines, mockNotifications } from '../mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Simulated "Live" state
  const [activeWorkers] = useState(12);
  
  // Notification State
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  // User Data State
  const [user, setUser] = useState({
      name: 'Usuario',
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'
  });

  useEffect(() => {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUser({ name: profile.name, imageUrl: profile.imageUrl });
      }
  }, []);

  // Load Farms (from LocalStorage or Mock)
  const [farms] = useState(() => {
      const savedFarms = localStorage.getItem('bovine_farms');
      if (savedFarms) return JSON.parse(savedFarms);
      localStorage.setItem('bovine_farms', JSON.stringify(farmsData));
      return farmsData;
  });

  // Load Inventory (from LocalStorage or Mock) for Global Counts
  const [inventory, setInventory] = useState<any[]>([]);
  useEffect(() => {
      const savedBovines = localStorage.getItem('bovine_inventory');
      if (savedBovines) {
          setInventory(JSON.parse(savedBovines));
      } else {
          localStorage.setItem('bovine_inventory', JSON.stringify(allBovines));
          setInventory(allBovines);
      }
  }, []);

  // Helper to count active animals per farm using loaded inventory
  const getFarmCount = (farmId: string, initialHead: number = 0) => {
    const bovineCount = inventory.filter(b => b.farmId === farmId && b.status === 'Active').length;
    return Math.max(bovineCount, initialHead || 0);
  };

  // Calculate global total using loaded inventory
  const totalAnimals = inventory.filter(b => b.status === 'Active').length + farms.reduce((acc: number, f: any) => acc + (f.totalHead || 0), 0);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-white font-display pb-20" onClick={() => setShowNotifications(false)}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
            <img 
              src={user.imageUrl} 
              className="w-10 h-10 rounded-full ring-2 ring-surface-dark object-cover" 
              alt="Profile" 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background-dark"></div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Bienvenido, {user.name.split(' ')[0]}</p>
            <h1 className="text-xl font-extrabold leading-none tracking-tight">Centro de Control</h1>
          </div>
        </div>
        
        {/* Notification Bell with Dropdown */}
        <div className="relative">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                }}
                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-surface-dark text-white' : 'hover:bg-surface-dark text-gray-300'}`}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border border-background-dark rounded-full animate-pulse"></span>
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
                                    {/* Notif Content */}
                                    <div className="flex gap-3">
                                        <div className={`mt-1 shrink-0 ${
                                            n.type === 'alert' ? 'text-red-400' : 
                                            n.type === 'success' ? 'text-primary' : 'text-blue-400'
                                        }`}>
                                            {n.type === 'alert' ? <AlertTriangle size={18} /> : 
                                             n.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                                                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{n.time}</span>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-300' : 'text-gray-500'}`}>{n.message}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => deleteNotification(e, n.id)}
                                            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    {!n.read && (
                                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 bg-surface-darker/30 text-center border-t border-white/5">
                        <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">Ver historial completo</button>
                    </div>
                </div>
            )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        {/* Farms Carousel */}
        <section className="mt-2">
          <div className="px-5 mb-3 flex justify-between items-end">
            <h2 className="text-lg font-bold">Mis Fincas</h2>
            <button onClick={() => navigate('/farms')} className="text-primary text-sm font-semibold hover:underline">Ver Todas</button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-5 pb-4 no-scrollbar snap-x snap-mandatory">
            {farms.map((farm: any) => {
              const count = getFarmCount(farm.id, farm.totalHead);
              return (
                <div key={farm.id} onClick={() => navigate(`/inventory?farmId=${farm.id}`)} className="relative flex-none w-[85%] max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden snap-center group shadow-xl bg-card-dark border border-white/10 cursor-pointer">
                    <img src={farm.imageUrl} alt={farm.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/95 via-background-dark/40 to-transparent"></div>
                    
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
                    <div className="flex justify-between items-start mb-auto pt-4">
                        <span className={`backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 ${farm.status === 'Active' ? 'bg-primary/90 text-background-dark' : 'bg-white/10 text-white'}`}>
                        {farm.status === 'Active' ? 'Activa' : 'Mantenimiento'}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition">
                        <MoreHorizontal size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                        <span className="bg-surface-darker/80 backdrop-blur-sm text-primary border border-primary/20 px-2 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold">
                            <Gauge size={14} />
                            {count} Cabezas
                        </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white leading-tight">{farm.name}</h3>
                        <div className="flex items-center gap-1.5 text-gray-300 pt-1">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm font-medium">{farm.location}</span>
                        </div>
                    </div>
                    </div>
                </div>
              );
            })}

            {/* Add New Farm Card */}
            <div onClick={() => navigate('/register-farm')} className="relative flex-none w-[85%] max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden snap-center bg-surface-dark border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-center p-6 group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar Finca</h3>
                <p className="text-sm text-gray-400">Añadir nueva propiedad</p>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Summary */}
        <section className="px-5">
          <div className="flex items-center gap-2 mb-3">
             <h2 className="text-lg font-bold">Resumen Operativo</h2>
             <div className="flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide">En Vivo</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Milk KPI */}
            <div className="col-span-2 bg-surface-dark rounded-2xl p-5 shadow-sm border border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-accent-amber mb-1">
                  <Droplets size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Producción Total</span>
                </div>
                <span className="text-4xl font-extrabold text-white tracking-tight">12,500 <span className="text-xl text-gray-500 font-bold">L</span></span>
                <div className="flex items-center gap-1 text-xs text-primary font-medium mt-1">
                  <TrendingUp size={14} />
                  <span>+5.2% vs ayer</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-surface-darker border-t-accent-amber border-r-accent-amber flex items-center justify-center transform rotate-45">
                <Droplets className="text-accent-amber transform -rotate-45" size={24} />
              </div>
            </div>

            {/* Population KPI (Clickable) */}
            <div 
              onClick={() => navigate('/inventory')} 
              className="bg-surface-dark rounded-2xl p-4 shadow-sm border border-white/5 flex flex-col gap-3 cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="bg-surface-darker w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-colors">
                <Gauge size={20} />
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">{totalAnimals.toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-medium">Población Total</span>
              </div>
            </div>

            {/* Workers KPI */}
            <div onClick={() => navigate('/hr')} className="bg-surface-dark rounded-2xl p-4 shadow-sm border border-white/5 flex flex-col gap-3 cursor-pointer hover:border-primary/50 transition-colors group">
              <div className="bg-surface-darker w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-colors">
                <Users size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white block">{activeWorkers}</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Trabajadores Activos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="px-5 pb-8">
          <h2 className="text-lg font-bold mb-3">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => navigate('/inventory')} className="flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-white/5 active:scale-[0.98] transition-all group hover:border-white/10">
              <div className="bg-teal-500/10 text-teal-400 p-2 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                <ClipboardList size={24} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-white">Gestionar Inventario</h3>
                <p className="text-xs text-gray-500">Ver listado global de animales</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>

            <button onClick={() => navigate('/add-cheese')} className="flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-white/5 active:scale-[0.98] transition-all group hover:border-white/10">
              <div className="bg-yellow-500/10 text-yellow-400 p-2 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <Disc size={24} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-white">Registrar Queso</h3>
                <p className="text-xs text-gray-500">Producción de derivados</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>

            <button onClick={() => navigate('/transfers')} className="flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-white/5 active:scale-[0.98] transition-all group hover:border-white/10">
              <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ArrowRight size={24} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-white">Iniciar Traslado</h3>
                <p className="text-xs text-gray-500">Mover ganado entre fincas</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>

            <button onClick={() => navigate('/veterinary-ai/general')} className="flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-white/5 active:scale-[0.98] transition-all group hover:border-white/10">
              <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <BrainCircuit size={24} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-white">Consultar IA Veterinaria</h3>
                <p className="text-xs text-gray-500">Preguntas rápidas y diagnóstico</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>
          </div>
        </section>
      </main>

      <button 
        onClick={() => navigate('/register-bovine')}
        className="fixed bottom-24 right-5 z-40 bg-primary hover:bg-primary-dark text-background-dark font-bold pl-4 pr-5 py-3.5 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95"
      >
        <span className="bg-black/10 rounded-full p-0.5"><Plus size={20} /></span>
        Nuevo Bovino
      </button>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
