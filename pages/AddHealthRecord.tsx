import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Syringe, Pill, Stethoscope, Calendar, FileText, Save, DollarSign, BellRing } from 'lucide-react';

type HealthType = 'Vaccine' | 'Treatment' | 'Checkup';

const AddHealthRecord: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [type, setType] = useState<HealthType>('Treatment');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [boosterDate, setBoosterDate] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1500);
  };

  const types: { id: HealthType; label: string; icon: any; color: string }[] = [
      { id: 'Treatment', label: 'Tratamiento', icon: Pill, color: 'text-red-400 border-red-500/50 bg-red-500/10' },
      { id: 'Vaccine', label: 'Vacunación', icon: Syringe, color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' },
      { id: 'Checkup', label: 'Consulta / Rev', icon: Stethoscope, color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' },
  ];

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold leading-none">Registro Sanitario</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {id || '5783-2'}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Selector */}
          <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 ml-1">Tipo de Evento</label>
              <div className="grid grid-cols-3 gap-3">
                  {types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            type === t.id 
                            ? t.color + ' shadow-lg scale-[1.02]'
                            : 'bg-surface-dark border-white/5 text-gray-500 hover:bg-white/5'
                        }`}
                      >
                          <t.icon size={24} />
                          <span className="text-xs font-bold">{t.label}</span>
                      </button>
                  ))}
              </div>
          </div>

          <div className="space-y-4">
            {/* Name/Product */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">
                  {type === 'Vaccine' ? 'Nombre de la Vacuna' : type === 'Treatment' ? 'Medicamento / Enfermedad' : 'Motivo Consulta'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500">
                    {type === 'Vaccine' ? <Syringe size={20} /> : <FileText size={20} />}
                </div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'Vaccine' ? 'Ej. Aftosa, Brucelosis' : 'Ej. Mastitis, Vitaminas'} 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha de Aplicación</label>
                <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* BOOSTER DATE (Conditional) */}
            {type === 'Vaccine' && (
                <div className="bg-accent-amber/5 border border-accent-amber/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-accent-amber mb-2 ml-1">
                        <BellRing size={16} />
                        Programar Refuerzo (Opcional)
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                        <input 
                            type="date" 
                            value={boosterDate}
                            onChange={(e) => setBoosterDate(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber outline-none transition-all"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 ml-1">Se creará una alerta automática para esta fecha.</p>
                </div>
            )}

            {/* Cost (Optional) */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Costo (Opcional)</label>
                <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><DollarSign size={20} /></div>
                    <input 
                        type="number" 
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Observaciones / Dosis</label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Detalles adicionales, dosis aplicada, veterinario a cargo..."
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
            </div>
          </div>

        </form>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={loading || !title}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Save size={20} />
              Guardar Registro
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddHealthRecord;