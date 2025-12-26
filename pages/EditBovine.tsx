
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Trash2, Heart, Droplets, Stethoscope, Tag, Weight, Calendar, Dna, Search, X, CheckCircle2, Type } from 'lucide-react';

const EditBovine: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock initial data
  const [formData, setFormData] = useState({
    tag: '5783-2',
    name: '', // Added name field
    breed: 'Holstein',
    weight: '450',
    birthDate: '2020-05-10',
    category: 'Vaca',
    // Status flags
    isSick: false,
    isPregnant: true,
    isLactating: true,
    // Genealogy
    father: 'Thunderbolt',
    mother: 'Bessie'
  });

  // --- SELECTION MODAL STATE ---
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<'father' | 'mother' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATA FOR SELECTION ---
  const availableBulls = [
      { id: 'b1', tag: '9921-T', name: 'Thunderbolt', breed: 'Brahman' },
      { id: 'b2', tag: '1002-A', name: 'Zeus', breed: 'Angus' },
      { id: 'b3', tag: '5050', name: 'El Rey', breed: 'Gyr' },
      { id: 'b4', tag: '8811', name: 'Titan', breed: 'Holstein' },
  ];

  const availableCows = [
      { id: 'c1', tag: '1029', name: 'Bessie', breed: 'Holstein' },
      { id: 'c2', tag: '2201-B', name: 'Lola', breed: 'Jersey' },
      { id: 'c3', tag: '3399', name: 'Rosita', breed: 'Gyr' },
      { id: 'c4', tag: '4040', name: 'Manchas', breed: 'Holstein' },
      { id: 'c5', tag: '5783-1', name: 'La Negra', breed: 'Angus' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1500);
  };

  const toggleStatus = (key: 'isSick' | 'isPregnant' | 'isLactating') => {
      setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const openSelection = (type: 'father' | 'mother') => {
      setSelectionType(type);
      setSearchQuery('');
      setIsSelectionOpen(true);
  }

  const handleSelect = (animalName: string) => {
      if (selectionType === 'father') setFormData(prev => ({ ...prev, father: animalName }));
      if (selectionType === 'mother') setFormData(prev => ({ ...prev, mother: animalName }));
      setIsSelectionOpen(false);
  }

  const getFilteredList = () => {
      const list = selectionType === 'father' ? availableBulls : availableCows;
      if (!searchQuery) return list;
      return list.filter(item => 
          item.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Editar Bovino</h1>
        </div>
        <button className="text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors">
            <Trash2 size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Header Image & IDs */}
          <div className="flex gap-4 mb-2">
             <div className="relative group cursor-pointer shrink-0">
                <img 
                    src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop" 
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-white/10"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} />
                </div>
             </div>
             <div className="flex-1 flex flex-col justify-center">
                 {/* ID Tag */}
                 <div className="mb-3">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Identificación</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.tag}
                            onChange={(e) => setFormData({...formData, tag: e.target.value})}
                            className="w-full bg-transparent border-b border-white/20 pb-1 text-2xl font-bold text-white focus:border-primary outline-none transition-all"
                        />
                        <Tag size={16} className="absolute right-0 top-1 text-gray-500" />
                    </div>
                 </div>

                 {/* Name (Optional) */}
                 <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Nombre (Opcional)</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ej. Mariposa"
                            className="w-full bg-transparent border-b border-white/10 pb-1 text-base text-gray-300 focus:border-white/40 outline-none transition-all placeholder:text-gray-600"
                        />
                        <Type size={16} className="absolute right-0 top-1 text-gray-600" />
                    </div>
                 </div>
             </div>
          </div>

          {/* Status Toggles */}
          <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 ml-1">Estado Actual</label>
              <div className="grid grid-cols-3 gap-3">
                  {/* Sick Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStatus('isSick')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.isSick 
                        ? 'bg-status-sick/20 border-status-sick text-status-sick shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : 'bg-surface-dark border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                      <Stethoscope size={24} />
                      <span className="text-xs font-bold">Enferma</span>
                  </button>

                  {/* Pregnant Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStatus('isPregnant')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.isPregnant 
                        ? 'bg-status-pregnant/20 border-status-pregnant text-status-pregnant shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                        : 'bg-surface-dark border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                      <Heart size={24} fill={formData.isPregnant ? "currentColor" : "none"} />
                      <span className="text-xs font-bold">Preñada</span>
                  </button>

                  {/* Lactating Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStatus('isLactating')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.isLactating 
                        ? 'bg-status-lactating/20 border-status-lactating text-status-lactating shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-surface-dark border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                      <Droplets size={24} fill={formData.isLactating ? "currentColor" : "none"} />
                      <span className="text-xs font-bold">Lactancia</span>
                  </button>
              </div>
          </div>

          <div className="h-px bg-white/5 w-full my-2"></div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Breed */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Raza</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><Dna size={20} /></div>
                        <input 
                            type="text" 
                            value={formData.breed}
                            onChange={(e) => setFormData({...formData, breed: e.target.value})}
                            className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>
                {/* Weight */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Peso (kg)</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><Weight size={20} /></div>
                        <input 
                            type="number" 
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Categoría</label>
              <div className="grid grid-cols-4 gap-2">
                {['Vaca', 'Novilla', 'Ternero', 'Toro'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                        formData.category === cat 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-surface-dark border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Date */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha de Nacimiento</label>
                <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                <input 
                    type="date" 
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                </div>
            </div>

            {/* Genealogy Section (UPDATED) */}
            <div className="pt-2">
                <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1 uppercase tracking-wider border-b border-white/5 pb-1">Genealogía</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-blue-400 mb-2 ml-1">Padre (Toro)</label>
                        <div className="relative group cursor-pointer" onClick={() => openSelection('father')}>
                            <div className="absolute left-4 top-4 text-blue-400 font-bold text-xs">♂</div>
                            <input 
                                type="text" 
                                value={formData.father}
                                readOnly
                                placeholder="Seleccionar..."
                                className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-8 pr-10 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all text-sm font-bold cursor-pointer hover:bg-white/5"
                            />
                            <Search size={16} className="absolute right-4 top-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-pink-400 mb-2 ml-1">Madre (Vaca)</label>
                        <div className="relative group cursor-pointer" onClick={() => openSelection('mother')}>
                            <div className="absolute left-4 top-4 text-pink-400 font-bold text-xs">♀</div>
                            <input 
                                type="text" 
                                value={formData.mother}
                                readOnly
                                placeholder="Seleccionar..."
                                className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-8 pr-10 text-white placeholder-gray-600 focus:border-pink-500 outline-none transition-all text-sm font-bold cursor-pointer hover:bg-white/5"
                            />
                            <Search size={16} className="absolute right-4 top-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Save size={20} />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* --- SELECTION MODAL --- */}
      {isSelectionOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
              <div className="bg-surface-dark w-full max-w-md h-[80vh] rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-3">
                      <button onClick={() => setIsSelectionOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <X size={20} className="text-gray-400" />
                      </button>
                      <h2 className="text-lg font-bold text-white">
                          Seleccionar {selectionType === 'father' ? 'Padre' : 'Madre'}
                      </h2>
                  </div>

                  {/* Search */}
                  <div className="p-4 pb-2">
                      <div className="relative">
                          <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
                          <input 
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={`Buscar ${selectionType === 'father' ? 'toro' : 'vaca'}...`}
                              className="w-full bg-surface-darker border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-primary outline-none transition-all"
                              autoFocus
                          />
                      </div>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {getFilteredList().map((animal) => (
                          <div 
                              key={animal.id} 
                              onClick={() => handleSelect(animal.name)}
                              className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-white/5 cursor-pointer transition-all active:scale-[0.98]"
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${
                                      selectionType === 'father' 
                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                      : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                                  }`}>
                                      {selectionType === 'father' ? '♂' : '♀'}
                                  </div>
                                  <div>
                                      <p className="font-bold text-white text-sm">{animal.name}</p>
                                      <p className="text-xs text-gray-500 font-mono">ID: {animal.tag}</p>
                                  </div>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 bg-surface-darker px-2 py-1 rounded border border-white/5">
                                  {animal.breed}
                              </span>
                          </div>
                      ))}
                      {getFilteredList().length === 0 && (
                          <div className="text-center py-8 text-gray-500 text-sm">
                              No se encontraron resultados.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default EditBovine;
