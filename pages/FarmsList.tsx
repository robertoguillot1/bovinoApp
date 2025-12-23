import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Gauge, MoreVertical, Search, Edit2, Trash2, Droplets } from 'lucide-react';
import { farmsData, allBovines } from '../mockData'; // Import shared data

const FarmsList: React.FC = () => {
  const navigate = useNavigate();
  
  // State for the menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Initialize with centralized data
  const [farms, setFarms] = useState(farmsData.map(f => ({
    ...f,
    // Add dummy milk production logic if not present in base type, or handle it
    milkProduction: f.id === '1' ? 12500 : f.id === '2' ? 5400 : 0 
  })));

  // Helper to calculate active animals
  const getFarmCount = (farmId: string) => {
    return allBovines.filter(b => b.farmId === farmId && b.status === 'Active').length;
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation to inventory
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar esta finca? Esta acción no se puede deshacer.')) {
        setFarms(farms.filter(f => f.id !== id));
        setActiveMenuId(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      navigate('/register-farm'); 
      setActiveMenuId(null);
  };

  return (
    <div 
        className="bg-background-dark min-h-screen text-white font-display flex flex-col"
        onClick={() => setActiveMenuId(null)} // Close menu when clicking background
    >
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Mis Fincas</h1>
        </div>
        <button onClick={() => navigate('/register-farm')} className="w-10 h-10 rounded-full bg-primary text-background-dark flex items-center justify-center hover:bg-primary-dark transition-colors">
            <Plus size={24} />
        </button>
      </header>
      
      {/* Search */}
      <div className="p-4 pb-0">
        <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
                type="text" 
                placeholder="Buscar finca..." 
                className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 mt-2">
        {farms.map((farm) => {
            const count = getFarmCount(farm.id);
            return (
                <div 
                    key={farm.id} 
                    onClick={() => navigate(`/inventory?farmId=${farm.id}`)} 
                    className="bg-surface-dark rounded-2xl border border-white/5 shadow-sm hover:border-primary/50 transition-all cursor-pointer group relative"
                >
                    <div className="h-32 w-full relative overflow-hidden rounded-t-2xl">
                        <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border border-white/10 ${farm.status === 'Active' ? 'bg-primary/90 text-background-dark' : 'bg-black/60 text-white'}`}>
                                {farm.status === 'Active' ? 'Activa' : 'Mantenimiento'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-4 -mt-6 relative z-10">
                        <div className="flex justify-between items-start mb-1 relative">
                            <h2 className="text-xl font-bold text-white max-w-[80%]">{farm.name}</h2>
                            
                            {/* 3 Dots Button */}
                            <div className="relative">
                                <button 
                                    onClick={(e) => toggleMenu(e, farm.id)}
                                    className="text-gray-400 hover:text-white p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                {activeMenuId === farm.id && (
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <button 
                                            onClick={(e) => handleEdit(e, farm.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white text-left"
                                        >
                                            <Edit2 size={16} /> Editar
                                        </button>
                                        <div className="h-px bg-white/5 mx-2"></div>
                                        <button 
                                            onClick={(e) => handleDelete(e, farm.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-400 mb-4">
                            <MapPin size={16} className="text-primary" />
                            <span className="text-sm">{farm.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-surface-darker flex items-center justify-center text-gray-400 border border-white/5">
                                    <Gauge size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Inventario</p>
                                    <p className="text-sm font-bold text-white">{count} <span className="text-xs font-normal text-gray-500">Cabezas</span></p>
                                </div>
                            </div>
                            {farm.milkProduction > 0 && (
                                <div className="flex items-center gap-3 flex-1 border-l border-white/5 pl-4">
                                    <div className="w-10 h-10 rounded-lg bg-surface-darker flex items-center justify-center text-accent-amber border border-white/5">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Producción</p>
                                        <p className="text-sm font-bold text-white">{farm.milkProduction.toLocaleString()} <span className="text-xs font-normal text-gray-500">L/día</span></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}

        <div 
            onClick={() => navigate('/register-farm')}
            className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 gap-2 hover:bg-white/5 hover:border-white/20 hover:text-white transition-all cursor-pointer"
        >
            <Plus size={32} />
            <span className="font-bold">Registrar Otra Finca</span>
        </div>
      </main>
    </div>
  );
};

export default FarmsList;