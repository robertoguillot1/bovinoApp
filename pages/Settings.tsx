
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, ChevronRight, User, Lock, Fingerprint, 
  Tractor, PlusCircle, BriefcaseMedical, ClipboardCheck, 
  Package, Moon, Type, FileText, Info, LogOut, Sun 
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // Toggles State
  const [biometrics, setBiometrics] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [tasksAlerts, setTasksAlerts] = useState(false);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
      const savedTheme = localStorage.getItem('app_theme');
      return savedTheme !== 'light'; // Default to dark
  });
  
  // Text Size State (Default 16px)
  const [textSize, setTextSize] = useState(() => {
      return parseInt(localStorage.getItem('app_text_size') || '16');
  });

  // User Data State
  const [user, setUser] = useState({
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@hacienda.com',
      role: 'Administrador General',
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300'
  });

  useEffect(() => {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
          setUser(JSON.parse(savedProfile));
      }
  }, []);

  // Handle Text Size Change
  const handleTextSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = parseInt(e.target.value);
      setTextSize(newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
      localStorage.setItem('app_text_size', newSize.toString());
  };

  // Handle Theme Change
  const handleThemeChange = (isDark: boolean) => {
      setDarkMode(isDark);
      if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('app_theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('app_theme', 'light');
      }
  };

  // Helper Component for Section Headers
  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-gray-500 dark:text-gray-500 text-xs font-bold uppercase tracking-wider px-6 pb-2 mt-6 mb-1">
      {title}
    </h3>
  );

  // Helper Component for Navigation Items
  const NavItem = ({ icon: Icon, colorClass, title, subtitle, onClick }: any) => (
    <div 
      onClick={onClick}
      className="group flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
    >
      <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-slate-900 dark:text-white text-base font-medium">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      <ChevronRight size={20} className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
    </div>
  );

  // Helper Component for Toggle Items
  const ToggleItem = ({ icon: Icon, colorClass, title, value, onChange }: any) => (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/5 last:border-0">
      <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-slate-900 dark:text-white text-base font-medium">{title}</p>
      </div>
      <div 
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${value ? 'right-1' : 'left-1'}`}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col transition-colors duration-200">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={() => navigate('/')} 
          className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Configuración
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col pb-8 overflow-y-auto">
        
        {/* ProfileHeader */}
        <div className="px-4 py-6">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="relative shrink-0">
              <img 
                src={user.imageUrl} 
                alt="Profile"
                className="rounded-full h-16 w-16 ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-background-dark object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-primary text-black rounded-full p-1 border-2 border-white dark:border-surface-dark group-hover:scale-110 transition-transform">
                <Edit2 size={12} />
              </div>
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight truncate">{user.name}</p>
              <p className="text-primary font-medium text-sm">{user.role}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">{user.email}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Section: Cuenta */}
        <div>
          <SectionHeader title="Cuenta" />
          <div className="flex flex-col bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-white/5">
            <NavItem 
              icon={User} 
              colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
              title="Información Personal" 
              onClick={() => navigate('/profile')}
            />
            <NavItem 
              icon={Lock} 
              colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" 
              title="Seguridad y Contraseña" 
            />
            <ToggleItem 
              icon={Fingerprint} 
              colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
              title="Datos Biométricos" 
              value={biometrics}
              onChange={setBiometrics}
            />
          </div>
        </div>

        {/* Section: Gestión de Fincas */}
        <div>
          <SectionHeader title="Gestión de Fincas" />
          <div className="flex flex-col bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-white/5">
            <NavItem 
              icon={Tractor} 
              colorClass="bg-primary/20 text-primary" 
              title="Mis Fincas" 
              subtitle="3 activas"
              onClick={() => navigate('/farms')}
            />
            <NavItem 
              icon={PlusCircle} 
              colorClass="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500" 
              title="Añadir Nueva Finca" 
              onClick={() => navigate('/register-farm')}
            />
          </div>
        </div>

        {/* Section: Notificaciones */}
        <div>
          <SectionHeader title="Notificaciones" />
          <div className="flex flex-col bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-white/5">
            <ToggleItem 
              icon={BriefcaseMedical} 
              colorClass="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
              title="Alertas Sanitarias" 
              value={healthAlerts}
              onChange={setHealthAlerts}
            />
            <ToggleItem 
              icon={ClipboardCheck} 
              colorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" 
              title="Tareas del Personal" 
              value={tasksAlerts}
              onChange={setTasksAlerts}
            />
            <ToggleItem 
              icon={Package} 
              colorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
              title="Inventario" 
              value={inventoryAlerts}
              onChange={setInventoryAlerts}
            />
          </div>
        </div>

        {/* Section: Apariencia */}
        <div>
          <SectionHeader title="Apariencia" />
          <div className="flex flex-col bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-white/5">
            <ToggleItem 
              icon={darkMode ? Moon : Sun} 
              colorClass="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300" 
              title="Modo Oscuro" 
              value={darkMode}
              onChange={handleThemeChange}
            />
            
            {/* Text Size Slider (Functional) */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 shrink-0 size-10">
                <Type size={20} />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium mb-1">Tamaño de Texto</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-bold">A</span>
                  <input 
                    type="range" 
                    min="14" 
                    max="22" 
                    step="1"
                    value={textSize}
                    onChange={handleTextSizeChange}
                    className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-lg text-slate-900 dark:text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Acerca de */}
        <div className="mb-6">
          <SectionHeader title="Acerca de" />
          <div className="flex flex-col bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-white/5">
            <NavItem 
              icon={FileText} 
              colorClass="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300" 
              title="Términos y Condiciones" 
            />
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 shrink-0 size-10">
                <Info size={20} />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium">Versión</p>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">v1.0.4</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-xl border border-red-500/20 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 font-bold text-base flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-[0.98]"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
