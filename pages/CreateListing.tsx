
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle2, Circle, ArrowRight, DollarSign, Camera, Image, X, Info, Calendar, Weight } from 'lucide-react';
import { allBovines } from '../mockData';

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Form State
  const [price, setPrice] = useState('');
  const [allowOffers, setAllowOffers] = useState(true);
  const [description, setDescription] = useState('');

  // Step 1: Selection Logic
  const toggleSelection = (id: string) => {
    // For MVP, single selection only
    setSelectedIds([id]);
  };

  const handleNext = () => {
    if (selectedIds.length > 0) setStep(2);
  };

  const handlePublish = () => {
      // Logic to publish
      navigate('/market');
  };

  const selectedAnimal = allBovines.find(b => b.id === selectedIds[0]);

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      
      {/* Header */}
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => step === 1 ? navigate('/market') : setStep(1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                 {step === 1 ? <X size={24} /> : <ArrowLeft size={24} />}
            </button>
            <h1 className="text-xl font-bold">{step === 1 ? 'Seleccionar Ganado' : 'Nuevo Anuncio'}</h1>
        </div>
        {step === 1 && <span className="text-primary font-bold text-sm">Paso 1 de 3</span>}
        {step === 2 && <span className="text-primary font-bold text-sm">Ayuda</span>}
      </header>

      {/* --- STEP 1: SELECTION --- */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
            {/* Filter Bar */}
            <div className="p-4 pb-2">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por arete, raza o categoría..." 
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                        Filtros Activos: 0
                    </button>
                    <button className="bg-surface-dark border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-gray-300 whitespace-nowrap">
                        Lote: Los Naranjos
                    </button>
                    <button className="bg-surface-dark border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-gray-300 whitespace-nowrap">
                        Raza: Brahman
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
                {allBovines.map(animal => {
                    const isSelected = selectedIds.includes(animal.id);
                    return (
                        <div 
                            key={animal.id} 
                            onClick={() => toggleSelection(animal.id)}
                            className={`relative rounded-2xl overflow-hidden border transition-all cursor-pointer ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-white/5'}`}
                        >
                            <div className="aspect-[4/3] w-full relative">
                                <img src={animal.imageUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                
                                {/* Selection Indicator */}
                                <div className="absolute top-3 right-3">
                                    {isSelected ? (
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle2 size={20} className="text-black" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-black/20 backdrop-blur-sm"></div>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-accent-amber/20 backdrop-blur-md text-accent-amber border border-accent-amber/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-amber"></div>
                                        {animal.reproductiveStatus === 'Pregnant' ? 'Gestante' : 'Producción'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-surface-dark p-4 flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gray-400">{animal.breed}</span>
                                        <span className="text-xs font-bold text-white">ID: {animal.tag}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{animal.category === 'Cow' ? 'Vaca Lechera' : 'Toro Reproductor'}</h3>
                                </div>
                                <div className="flex flex-col items-end text-gray-400 text-xs font-medium">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Calendar size={12} /> {animal.age}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Weight size={12} /> {animal.weight}kg
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>

            {/* Sticky Footer */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-0 w-full p-4 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">SELECCIONADOS</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{selectedIds.length}</span>
                            <span className="text-sm font-normal text-gray-500">animales</span>
                        </div>
                    </div>
                    
                    {/* Animal Avatars Preview */}
                    <div className="flex -space-x-2 mr-4">
                        {selectedIds.map((id, i) => (
                            <img key={id} src={allBovines.find(b => b.id === id)?.imageUrl} className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" />
                        ))}
                    </div>

                    <button 
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary-dark text-background-dark px-8 py-3.5 rounded-full font-bold text-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95"
                    >
                        Siguiente <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
      )}

      {/* --- STEP 2: DETAILS FORM --- */}
      {step === 2 && selectedAnimal && (
          <main className="flex-1 overflow-y-auto p-4 pb-32">
              
              {/* Selected Animal Summary */}
              <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">1. ANIMAL SELECCIONADO</p>
                  <div className="bg-surface-dark p-3 rounded-xl border border-white/5 flex gap-4 items-center">
                      <img src={selectedAnimal.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                          <h3 className="font-bold text-white">{selectedAnimal.breed} - #{selectedAnimal.tag}</h3>
                          <p className="text-xs text-gray-400">Lote: El Roble Norte</p>
                          <div className="flex gap-2 mt-1">
                              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-300 border border-white/5">{selectedAnimal.weight}kg</span>
                              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-300 border border-white/5">{selectedAnimal.age}</span>
                          </div>
                      </div>
                      <button onClick={() => setStep(1)} className="ml-auto text-primary text-xs font-bold hover:underline">Editar</button>
                  </div>
              </div>

              <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Detalles de Venta</h2>
                  <p className="text-gray-400 text-sm -mt-4 mb-6">Establece el precio y describe tu animal.</p>

                  {/* Price */}
                  <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                          <DollarSign size={16} className="text-primary" /> Precio de Venta
                      </label>
                      <div className="bg-surface-dark border border-white/10 rounded-xl p-4 flex items-center justify-between focus-within:border-primary transition-colors">
                          <span className="text-2xl font-bold text-gray-500">$</span>
                          <input 
                            type="number" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent text-right text-3xl font-bold text-white outline-none w-full placeholder-gray-600"
                          />
                          <span className="text-sm font-bold text-gray-400 ml-2">USD</span>
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-500 px-1">
                          <span>Sugerido: $420 - $480</span>
                          <span>Promedio Mercado: $1.05/kg</span>
                      </div>
                  </div>

                  {/* Description */}
                  <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                          <Info size={16} className="text-primary" /> Descripción
                      </label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Animal con todas las vacunas al día, excelente genética, listo para transporte..."
                        className="w-full h-32 bg-surface-dark border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-primary resize-none"
                      />
                  </div>

                  {/* Offers Toggle */}
                  <div className="bg-surface-dark border border-white/10 rounded-xl p-4 flex items-center justify-between">
                      <div>
                          <p className="font-bold text-white text-sm">Permitir Ofertas</p>
                          <p className="text-xs text-gray-500">Los compradores pueden negociar</p>
                      </div>
                      <div 
                        onClick={() => setAllowOffers(!allowOffers)}
                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${allowOffers ? 'bg-primary' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 bg-white w-5 h-5 rounded-full shadow transition-transform ${allowOffers ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>

                  {/* Photo Upload (Additional) */}
                  <div>
                      <h3 className="font-bold text-white text-sm mb-3">Fotos Adicionales <span className="text-gray-500 font-normal text-xs">(Opcional)</span></h3>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                           <div className="w-24 h-24 rounded-xl border border-white/10 bg-surface-dark relative overflow-hidden group shrink-0">
                               <img src={selectedAnimal.imageUrl} className="w-full h-full object-cover" />
                               <button className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white"><X size={12}/></button>
                           </div>
                           <button className="w-24 h-24 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 gap-1 hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all shrink-0">
                               <Camera size={24} />
                               <span className="text-[10px] font-bold uppercase">Añadir</span>
                           </button>
                           <button className="w-24 h-24 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 gap-1 hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all shrink-0">
                               <Image size={24} />
                           </button>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">Sube hasta 5 fotos para mejorar la visibilidad de tu anuncio.</p>
                  </div>

              </div>

              <div className="fixed bottom-0 left-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30 flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 bg-surface-dark hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                      <ArrowLeft size={20} /> Atrás
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="flex-[2] h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                  >
                      Publicar Anuncio <CheckCircle2 size={20} />
                  </button>
              </div>
          </main>
      )}

    </div>
  );
};

export default CreateListing;
