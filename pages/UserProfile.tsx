
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Briefcase, Save, Check } from 'lucide-react';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initial State
  const [formData, setFormData] = useState({
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@hacienda.com',
    phone: '+57 300 123 4567',
    role: 'Administrador General',
    location: 'Antioquia, Colombia',
    bio: 'Experto en ganadería sostenible y gestión de fincas.',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300'
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to LocalStorage
    localStorage.setItem('user_profile', JSON.stringify(formData));

    // Simulate Network Request
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // Reset success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6 bg-white/80 dark:bg-background-dark/95 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Editar Perfil</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-primary/50">
                        <img 
                            src={formData.imageUrl} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={32} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 right-2 bg-primary text-black p-2 rounded-full border-4 border-white dark:border-background-dark shadow-lg">
                        <Camera size={16} />
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toca para cambiar foto</p>
            </div>

            {/* Fields */}
            <div className="space-y-5">
                
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text" 
                            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel" 
                            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Cargo</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Ubicación</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Biografía Corta</label>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white resize-none"
                    ></textarea>
                </div>

            </div>
        </form>
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95 ${
                success 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-black hover:bg-primary-dark'
            }`}
        >
            {loading ? (
                <span className="animate-pulse">Guardando...</span>
            ) : success ? (
                <>
                    <Check size={24} /> Guardado
                </>
            ) : (
                <>
                    <Save size={24} /> Guardar Cambios
                </>
            )}
        </button>
      </div>

    </div>
  );
};

export default UserProfile;
