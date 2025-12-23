import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dna, Microscope, Baby, Calendar, Save, CheckCircle2, XCircle, Search, AlertTriangle } from 'lucide-react';

type EventType = 'Insemination' | 'Palpation' | 'Birth';

const AddReproductionEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [type, setType] = useState<EventType>('Insemination');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Specific Fields
  const [bullId, setBullId] = useState('');
  const [technician, setTechnician] = useState('');
  const [isPregnant, setIsPregnant] = useState<boolean | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [calfSex, setCalfSex] = useState<'Male' | 'Female'>('Female');
  const [birthDifficulty, setBirthDifficulty] = useState('Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold leading-none">Evento Reproductivo</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {id || '5783-2'}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType('Insemination')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    type === 'Insemination' 
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                    : 'bg-surface-dark border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                  <Dna size={28} />
                  <span className="text-xs font-bold">Inseminación</span>
              </button>

              <button
                type="button"
                onClick={() => setType('Palpation')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    type === 'Palpation' 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg'
                    : 'bg-surface-dark border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                  <Microscope size={28} />
                  <span className="text-xs font-bold">Palpación</span>
              </button>

              <button
                type="button"
                onClick={() => setType('Birth')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    type === 'Birth' 
                    ? 'border-primary bg-primary/20 text-primary shadow-lg'
                    : 'bg-surface-dark border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                  <Baby size={28} />
                  <span className="text-xs font-bold">Parto</span>
              </button>
          </div>

          {/* Dynamic Content */}
          <div className="bg-surface-dark border border-white/5 rounded-2xl p-5 space-y-5 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Common Date */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha del Evento</label>
                <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-surface-darker border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
              </div>

              {/* INSEMINATION FIELDS */}
              {type === 'Insemination' && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Toro / Pajilla</label>
                        <div className="relative">
                            <div className="absolute left-4 top-4 text-gray-500"><Search size={20} /></div>
                            <input 
                                type="text" 
                                value={bullId}
                                onChange={(e) => setBullId(e.target.value)}
                                placeholder="Ej. 504 (Jersey)"
                                className="w-full bg-surface-darker border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Inseminador / Técnico</label>
                        <input 
                            type="text" 
                            value={technician}
                            onChange={(e) => setTechnician(e.target.value)}
                            placeholder="Nombre del técnico"
                            className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                  </>
              )}

              {/* PALPATION FIELDS */}
              {type === 'Palpation' && (
                  <>
                     <div>
                        <label className="block text-sm font-bold text-gray-400 mb-3 ml-1">Resultado del Diagnóstico</label>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setIsPregnant(true)}
                                className={`flex-1 py-4 rounded-xl font-bold flex flex-col items-center gap-2 border-2 transition-all ${isPregnant === true ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-surface-darker border-white/5 text-gray-500'}`}
                            >
                                <CheckCircle2 size={24} />
                                Preñada (+)
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsPregnant(false)}
                                className={`flex-1 py-4 rounded-xl font-bold flex flex-col items-center gap-2 border-2 transition-all ${isPregnant === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-surface-darker border-white/5 text-gray-500'}`}
                            >
                                <XCircle size={24} />
                                Vacía (-)
                            </button>
                        </div>
                     </div>
                     {isPregnant && (
                         <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Semanas de Gestación</label>
                            <input 
                                type="number" 
                                value={weeksPregnant}
                                onChange={(e) => setWeeksPregnant(e.target.value)}
                                placeholder="Ej. 12"
                                className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-purple-500 outline-none transition-all"
                            />
                         </div>
                     )}
                  </>
              )}

              {/* BIRTH FIELDS */}
              {type === 'Birth' && (
                   <>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-3 ml-1">Sexo de la Cría</label>
                       <div className="flex bg-surface-darker p-1 rounded-xl border border-white/10">
                           <button 
                               type="button"
                               onClick={() => setCalfSex('Female')}
                               className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calfSex === 'Female' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-400'}`}
                           >
                               Hembra
                           </button>
                           <button 
                               type="button"
                               onClick={() => setCalfSex('Male')}
                               className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calfSex === 'Male' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400'}`}
                           >
                               Macho
                           </button>
                       </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Dificultad del Parto</label>
                        <select 
                            value={birthDifficulty}
                            onChange={(e) => setBirthDifficulty(e.target.value)}
                            className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none"
                        >
                            <option value="Normal">Normal (Sin Asistencia)</option>
                            <option value="Assisted">Asistido (Ligera Ayuda)</option>
                            <option value="Difficult">Distocia (Veterinario)</option>
                        </select>
                    </div>
                 </>
              )}

              {/* Common Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Observaciones</label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Detalles adicionales..."
                    className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-white/30 outline-none transition-all resize-none"
                />
            </div>
          </div>

        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-14 font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg ${
              type === 'Insemination' ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20' :
              type === 'Palpation' ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20' :
              'bg-primary hover:bg-primary-dark text-background-dark shadow-primary/20'
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Save size={20} />
              Registrar {type === 'Insemination' ? 'IA' : type === 'Palpation' ? 'Diagnóstico' : 'Nacimiento'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddReproductionEvent;