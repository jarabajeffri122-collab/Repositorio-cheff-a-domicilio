import React from 'react';
import { ShoppingBag, ShieldCheck, UserCheck, Sparkles, ChefHat, Lock } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  activeTab: 'crm' | 'catalog' | 'dashboard';
  setActiveTab: (tab: 'crm' | 'catalog' | 'dashboard') => void;
  currentUser: User;
  cartCount: number;
  onOpenCart: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  cartCount,
  onOpenCart,
  onSwitchRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8] shadow-xs">
      {/* Top Banner indicating the culinary service proposition */}
      <div className="bg-[#4F5E3D] text-[#FAF7F2] text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#EADBCC]" />
        <span>Chefs Privados a Domicilio y Kits de Especias de Autor (150g) · Servicio de Alta Cocina en su Hogar</span>
        <span className="hidden sm:inline text-[#FAF7F2]/60">·</span>
        <span className="hidden sm:inline text-xs text-[#FAF7F2]/80">Mise en place, cocina en vivo y limpieza integral</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C25E3E]/10 border border-[#C25E3E]/30 flex items-center justify-center text-[#C25E3E]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-[#261C14] block leading-none">
                Chef en Casa
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#756353] font-medium block mt-1">
                Alta Cocina a Domicilio · Kits 150g
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-[#F3EDE4] p-1 rounded-xl border border-[#E8DEC8]">
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-white text-[#9C4124] shadow-xs font-semibold'
                  : 'text-[#756353] hover:text-[#261C14] hover:bg-white/50'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-[#C25E3E]" />
              ) : (
                <UserCheck className="w-4 h-4 text-[#4F5E3D]" />
              )}
              <span className="hidden md:inline">Tablero 1:</span> CRM & Roles
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#9C4124] shadow-xs font-semibold'
                  : 'text-[#756353] hover:text-[#261C14] hover:bg-white/50'
              }`}
            >
              <span className="hidden md:inline">Tablero 2:</span> Catálogo & Reservas
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#9C4124] shadow-xs font-semibold'
                  : 'text-[#756353] hover:text-[#261C14] hover:bg-white/50'
              }`}
            >
              {currentUser.role !== 'admin' && (
                <Lock className="w-3.5 h-3.5 text-[#C25E3E]" />
              )}
              <span className="hidden md:inline">Tablero 3:</span> Dashboard & Reportes
              {currentUser.role !== 'admin' && (
                <span className="text-[10px] text-[#C25E3E] font-bold bg-[#C25E3E]/10 px-1.5 py-0.5 rounded-md hidden lg:inline">
                  Privado
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick role toggle */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-xs">
              <span className="text-[#756353]">Rol:</span>
              <button
                onClick={() => onSwitchRole(currentUser.role === 'admin' ? 'cliente' : 'admin')}
                className="font-semibold text-[#9C4124] hover:underline cursor-pointer flex items-center gap-1"
                title="Alternar entre Administrador y Cliente"
              >
                {currentUser.role === 'admin' ? 'Administrador' : 'Comprador'}
                <span className="text-[10px] text-[#756353]">(cambiar)</span>
              </button>
            </div>

            {/* Booking Cart button */}
            <button
              onClick={onOpenCart}
              aria-label="Abrir carrito de reservas"
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Reservas</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-[#FAF7F2] text-[#9C4124] rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
