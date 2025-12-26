
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, Dna, Calendar, Weight, Tag, MapPin, ChevronDown } from 'lucide-react';
import { farmsData, allBovines } from '../mockData';

const RegisterBovine: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Load Farms from LS to allow selection of created farms
  const [availableFarms, setAvailableFarms] = useState<any[]>([]);

  useEffect(() => {
      const savedFarms = localStorage.getItem('bovine_farms');
      if (savedFarms) {
          setAvailableFarms(JSON.parse(savedFarms));
      } else {
          setAvailableFarms(farmsData);
      }
  }, []);
  
  // Form State
  const [selectedFarm, setSelectedFarm] = useState('');
  const [tag, setTag] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [category, setCategory] = useState('Vaca');
  const [purpose, setPurpose] = useState('Leche');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm || !tag) return;

    setLoading(true);

    const newBovine = {
        id: Date.now().toString(),
        tag: tag,
        breed: breed || 'Desconocida',
        age: birthDate ? calculateAge(birthDate) : 'Recién Ingresado',
        weight: parseInt(weight) || 0,
        imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop', // Placeholder
        status: 'Active',
        category: category, // 'Cow', 'Heifer', etc mapped below or direct string
        gender: category === 'Toro' || category === 'Ternero' ? 'Male' : 'Female',
        healthStatus: 'Healthy',
        reproductiveStatus: 'Open',
        isLactating: category === 'Vaca' && purpose === 'Leche',
        lastWeighingDate: 'Hoy',
        farmId: selectedFarm
    };

    // Load existing inventory or init with mocks
    const savedBovines = localStorage.getItem('bovine_inventory');
    let currentInventory = savedBovines ? JSON.parse(savedBovines) : [...allBovines];
    
    // Add new bovine
    const updatedInventory = [newBovine, ...currentInventory];
    localStorage.setItem('bovine_inventory', JSON.stringify(updatedInventory));

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/inventory');
    }, 1000);
  };

  const calculateAge = (dateString: string) => {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age + ' Años';
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Nuevo Bovino</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Placeholder */}
          <div className="flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-white/20 rounded-2xl bg-surface-dark cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group">
            <div className="w-20 h-20 rounded-full bg-surface-darker flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                <Camera size={36} />
            </div>
            <span className="text-sm font-medium text-gray-400">Tomar Foto del Animal</span>
          </div>

          <div className="space-y-5">
            
            {/* FARM SELECTION (DYNAMIC) */}
            <div className="animate-in fade-in slide-in-from-bottom-2">
                <label className="block text-sm font-bold text-primary mb-2 ml-1">Finca / Ubicación</label>
                <div className="relative">
                    <div className="absolute left-4 top-4 text-primary"><MapPin size={20} /></div>
                    <select 
                        value={selectedFarm} 
                        onChange={(e) => setSelectedFarm(e.target.value)}
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white font-bold appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                        required
                    >
                        <option value="" disabled className="text-gray-500">Seleccionar finca de origen...</option>
                        {availableFarms.map(farm => (
                            <option key={farm.id} value={farm.id} className="bg-surface-dark text-white py-2">
                                {farm.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-4 text-gray-500 pointer-events-none">
                        <ChevronDown size={20} />
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 ml-1">El animal será añadido al inventario de esta propiedad.</p>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Identification */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Identificación (Arete / Nombre)</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Tag size={20} /></div>
                <input 
                  type="text" 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="ej. 5783-2" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold text-lg placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Breed */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Raza</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><Dna size={20} /></div>
                        <input 
                            type="text" 
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            placeholder="Holstein" 
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
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="0" 
                            className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Birth Date */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha de Nacimiento</label>
                <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                <input 
                    type="date" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Categoría</label>
              <div className="grid grid-cols-2 gap-2">
                {['Vaca', 'Novilla', 'Ternero', 'Toro'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        category === cat 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-surface-dark border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

             {/* Purpose Selection */}
             <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Propósito</label>
              <div className="flex bg-surface-dark p-1 rounded-xl border border-white/10">
                {['Leche', 'Carne', 'Doble'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        purpose === p 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading || !selectedFarm || !tag}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Check size={20} />
              Registrar Bovino
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterBovine;
