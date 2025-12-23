import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, MapPin, CheckCircle2, Circle, Search, Save, Archive } from 'lucide-react';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('Production');
  const [location, setLocation] = useState('');

  // Mock Animals for Selection
  const availableAnimals = [
    { id: '1', tag: '5783-2', breed: 'Holstein', weight: 450, category: 'Vaca' },
    { id: '2', tag: '9901-A', breed: 'Brahman', weight: 520, category: 'Vaca' },
    { id: '3', tag: '1102-C', breed: 'Angus', weight: 380, category: 'Novilla' },
    { id: '4', tag: '2201-B', breed: 'Jersey', weight: 410, category: 'Vaca' },
    { id: '5', tag: '3305-D', breed: 'Gyr', weight: 480, category: 'Novilla' },
  ];

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedIds.length === 0) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/inventory');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-xl font-bold leading-none">Nuevo Lote</h1>
            <p className="text-xs text-gray-400 mt-1">Agrupar animales</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Nombre del Grupo / Lote</label>
                <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><Archive size={20} /></div>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Ordeño Mañana, Engorde Lote 4"
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        autoFocus
                    />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Tipo</label>
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary"
                    >
                        <option value="Production">Producción (Leche)</option>
                        <option value="Fattening">Engorde / Ceba</option>
                        <option value="Weaning">Destete / Cría</option>
                        <option value="Quarantine">Cuarentena</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Ubicación</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><MapPin size={20} /></div>
                        <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ej. Potrero 5"
                            className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none"
                        />
                    </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          {/* Animal Selection */}
          <div>
             <div className="flex justify-between items-end mb-3">
                 <label className="block text-sm font-bold text-gray-400 ml-1">Seleccionar Miembros</label>
                 <span className="text-xs text-primary font-bold">{selectedIds.length} seleccionados</span>
             </div>
             
             {/* Search in list */}
             <div className="relative mb-3">
                 <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                 <input 
                    type="text" 
                    placeholder="Buscar animal..." 
                    className="w-full bg-surface-dark/50 border border-white/5 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:border-white/20 outline-none"
                 />
             </div>

             <div className="space-y-2">
                 {availableAnimals.map(animal => {
                     const isSelected = selectedIds.includes(animal.id);
                     return (
                        <div 
                            key={animal.id}
                            onClick={() => toggleSelection(animal.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                                isSelected 
                                ? 'bg-primary/10 border-primary/50' 
                                : 'bg-surface-dark border-white/5 hover:bg-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-primary text-black' : 'bg-surface-darker text-gray-400'}`}>
                                    {animal.tag.slice(-2)}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-white'}`}>{animal.tag}</p>
                                    <p className="text-xs text-gray-500">{animal.category} • {animal.breed}</p>
                                </div>
                            </div>
                            
                            {isSelected ? (
                                <CheckCircle2 size={20} className="text-primary" />
                            ) : (
                                <Circle size={20} className="text-gray-600" />
                            )}
                        </div>
                     )
                 })}
             </div>
          </div>

        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading || !name || selectedIds.length === 0}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Creando...</span>
          ) : (
            <>
              <Layers size={20} />
              Crear Lote
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateLot;