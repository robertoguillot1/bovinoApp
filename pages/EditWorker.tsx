import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Phone, DollarSign, Calendar, Camera, Save, Briefcase, Trash2, UserX, UserCheck } from 'lucide-react';

const EditWorker: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock initial data - In a real app, fetch based on ID
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    role: 'Mayordomo',
    phone: '+57 300 123 4567',
    salary: '1250000',
    status: 'Present' as 'Present' | 'Absent',
    admissionDate: '2022-03-15'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/hr');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <header className="p-4 pt-8 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
            <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Editar Perfil</h1>
        </div>
        <button className="text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors">
            <Trash2 size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo & Status Header */}
          <div className="flex flex-col items-center justify-center gap-4">
             <div className="relative group cursor-pointer">
                <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150" 
                    className={`w-28 h-28 rounded-full object-cover border-4 ${formData.status === 'Present' ? 'border-primary' : 'border-gray-500'} transition-colors`}
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} />
                </div>
             </div>
             
             {/* Status Toggles */}
             <div className="flex bg-surface-dark p-1 rounded-xl border border-white/10 w-full max-w-xs">
                <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Present'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                        formData.status === 'Present' 
                        ? 'bg-primary text-background-dark shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <UserCheck size={18} />
                    Activo / Presente
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Absent'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                        formData.status === 'Absent' 
                        ? 'bg-gray-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <UserX size={18} />
                    Ausente
                </button>
             </div>
             <p className="text-xs text-gray-500 text-center -mt-2">Define si el trabajador está disponible para tareas hoy.</p>
          </div>

          <div className="h-px bg-white/5 w-full my-4"></div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><User size={20} /></div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Rol / Cargo</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Briefcase size={20} /></div>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Teléfono</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Phone size={20} /></div>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Salario Base (COP)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500"><DollarSign size={20} /></div>
                    <input 
                      type="number" 
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full bg-surface-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
               </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Fecha de Ingreso</label>
                <div className="relative">
                <div className="absolute left-4 top-4 text-gray-500"><Calendar size={20} /></div>
                <input 
                    type="date" 
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
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
            <span className="animate-pulse">Actualizando...</span>
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

export default EditWorker;