
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Shield, Smartphone, Eye, EyeOff, Check, AlertTriangle, MapPin, Clock, LogOut, Lock } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Mock Login History
  const loginHistory = [
      { id: 1, device: 'iPhone 14 Pro', location: 'Bogotá, CO', time: 'Hace 2 minutos', status: 'Actual', icon: Smartphone },
      { id: 2, device: 'Chrome / Windows', location: 'Medellín, CO', time: 'Ayer, 10:30 AM', status: 'Éxito', icon: Shield },
      { id: 3, device: 'Samsung S21', location: 'Cali, CO', time: '12 Oct, 08:15 PM', status: 'Éxito', icon: Smartphone },
  ];

  const handlePasswordUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentPass || !newPass || !confirmPass) return;
      
      if (newPass !== confirmPass) {
          alert("Las contraseñas nuevas no coinciden");
          return;
      }

      setLoading(true);
      // Simulate API
      setTimeout(() => {
          setLoading(false);
          setSuccessMsg('Contraseña actualizada correctamente');
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
          setTimeout(() => setSuccessMsg(''), 3000);
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <header className="flex items-center gap-4 p-4 pt-6 bg-white/80 dark:bg-background-dark/95 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-lg font-bold tracking-tight">Seguridad</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Protege tu cuenta y datos</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-10 space-y-6">
        
        {/* Change Password Section */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                    <Key size={20} />
                </div>
                <h2 className="text-base font-bold">Cambiar Contraseña</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="relative">
                    <input 
                        type={showPass ? "text" : "password"}
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Contraseña Actual"
                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="relative">
                    <input 
                        type={showPass ? "text" : "password"}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Nueva Contraseña"
                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="relative">
                    <input 
                        type={showPass ? "text" : "password"}
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Confirmar Nueva Contraseña"
                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="pt-2">
                    {successMsg ? (
                        <div className="bg-green-500/10 text-green-500 p-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
                            <Check size={18} /> {successMsg}
                        </div>
                    ) : (
                        <button 
                            type="submit"
                            disabled={loading || !currentPass || !newPass}
                            className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </button>
                    )}
                </div>
            </form>
        </section>

        {/* 2FA & Alerts */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Autenticación en 2 Pasos</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mayor seguridad al iniciar sesión</p>
                    </div>
                </div>
                <div 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactor ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${twoFactor ? 'right-1' : 'left-1'}`}></div>
                </div>
            </div>
            
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Alertas de Inicio de Sesión</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Notificar nuevos dispositivos</p>
                    </div>
                </div>
                <div 
                    onClick={() => setLoginAlerts(!loginAlerts)}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${loginAlerts ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${loginAlerts ? 'right-1' : 'left-1'}`}></div>
                </div>
            </div>
        </section>

        {/* Activity Log */}
        <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">Actividad Reciente</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                {loginHistory.map((item) => (
                    <div key={item.id} className="p-4 border-b border-gray-100 dark:border-white/5 last:border-0 flex items-center gap-4">
                        <div className={`p-2.5 rounded-full ${item.status === 'Actual' ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                            <item.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.device}</h4>
                                {item.status === 'Actual' && (
                                    <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Actual</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><MapPin size={12}/> {item.location}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <button className="text-red-500 dark:text-red-400 text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg transition-colors">
                    <LogOut size={16} /> Cerrar Sesión en otros dispositivos
                </button>
            </div>
        </section>

      </main>
    </div>
  );
};

export default SecuritySettings;
