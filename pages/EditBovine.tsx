import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Trash2, Heart, Droplets, Stethoscope, Tag, Weight, Calendar, Dna } from 'lucide-react';

const EditBovine: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock initial data
  const [formData, setFormData] = useState({
    tag: '5783-2',
    breed: 'Holstein',
    weight: '450',
    birthDate: '2020-05-10',
    category: 'Vaca',
    // Status flags
    isSick: false,
    isPregnant: true,
    isLactating: true,
  });

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
          
          {/* Header Image & Main ID */}
          <div className="flex items-center gap-4 mb-2">
             <div className="relative group cursor-pointer shrink-0">
                <img 
                    src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop" 
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} />
                </div>
             </div>
             <div className="flex-1">
                 <label className="text-xs text-gray-500 font-bold uppercase">Identificación</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-2 text-2xl font-bold text-white focus:border-primary outline-none transition-all"
                    />
                    <Tag size={16} className="absolute right-0 top-3 text-gray-500" />
                 </div>
             </div>
          </div>

          {/* Status Toggles - CRITICAL SECTION */}
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
    </div>
  );
};

export default EditBovine;