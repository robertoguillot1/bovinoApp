import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Store, Users, Settings, ArrowLeftRight } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <button 
      onClick={() => navigate(path)} 
      className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${isActive(path) ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-300'}`}
    >
      <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 w-full bg-surface-dark/95 backdrop-blur-md border-t border-white/5 px-2 py-2 pb-6 flex justify-between items-center z-50">
      <NavItem path="/" icon={LayoutGrid} label="Inicio" />
      <NavItem path="/market" icon={Store} label="Mercado" />
      <NavItem path="/transfers" icon={ArrowLeftRight} label="Traslados" />
      <NavItem path="/hr" icon={Users} label="Equipo" />
      <NavItem path="/settings" icon={Settings} label="Ajustes" />
    </nav>
  );
};