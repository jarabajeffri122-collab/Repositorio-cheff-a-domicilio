import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle, ChefHat } from 'lucide-react';
import { User } from '../types';

interface AdminGateViewProps {
  onUnlockAsAdmin: (adminUser: User) => void;
  onNavigateToCatalog: () => void;
}

export const AdminGateView: React.FC<AdminGateViewProps> = ({
  onUnlockAsAdmin,
  onNavigateToCatalog,
}) => {
  const [emailInput, setEmailInput] = useState('jeffrijaraba@chefprivado.com');
  const [passwordInput, setPasswordInput] = useState('3008615272');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = emailInput.trim().toLowerCase();
    if (
      (emailLower === 'jeffrijaraba@chefprivado.com' && passwordInput === '3008615272') ||
      (emailLower === 'jeffrijaraba122@gmail.com' && passwordInput === 'Emiliano2002*') ||
      (emailLower === 'admin@chefencasa.com' && passwordInput === 'admin123')
    ) {
      onUnlockAsAdmin({
        id: 'usr-admin-01',
        name: 'Jeffri Jaraba (Administrador Ejecutivo)',
        email: 'jeffrijaraba@chefprivado.com',
        role: 'admin',
        phone: '+57 312 889 1234',
        address: 'Atelier de Alta Cocina, Bogotá D.C.',
      });
    } else {
      setErrorMsg('Credenciales no autorizadas. Usuario: jeffrijaraba@chefprivado.com / Clave: 3008615272');
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const handleQuickUnlock = () => {
    onUnlockAsAdmin({
      id: 'usr-admin-01',
      name: 'Jeffri Jaraba (Administrador Ejecutivo)',
      email: 'jeffrijaraba@chefprivado.com',
      role: 'admin',
      phone: '+57 312 889 1234',
      address: 'Atelier de Alta Cocina, Bogotá D.C.',
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border-2 border-[#E8DEC8] shadow-lg p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Top Decorative Accent */}
        <div className="w-20 h-20 rounded-full bg-[#C25E3E]/10 border border-[#C25E3E]/30 text-[#C25E3E] flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase tracking-widest text-[#9C4124] font-bold block mb-1">
          Acceso Restringido · Seguridad Culinaria
        </span>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#261C14] mb-3">
          Panel de Analítica y Reportes Bloqueado
        </h2>
        <p className="text-sm text-[#756353] leading-relaxed max-w-lg mx-auto mb-8">
          El módulo de reportes comerciales, balance financiero e historial completo de transacciones está reservado exclusivamente para la dirección y el <strong>Perfil Administrador</strong>.
        </p>

        {/* Credentials badge */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] mb-8 text-left max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#261C14]">
            <KeyRound className="w-4 h-4 text-[#9C4124]" />
            <span>Credenciales Autorizadas del Administrador:</span>
          </div>
          <div className="font-mono text-xs text-[#756353] space-y-1 bg-white p-3 rounded-xl border border-[#E8DEC8]">
            <div><span className="text-[#261C14] font-semibold">Usuario:</span> jeffrijaraba@chefprivado.com</div>
            <div><span className="text-[#261C14] font-semibold">Contraseña:</span> 3008615272</div>
          </div>
          <button
            type="button"
            onClick={handleQuickUnlock}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#4F5E3D] hover:bg-[#39452C] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Desbloquear como Administrador (1 Clic)</span>
          </button>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-4 max-w-md mx-auto text-left">
          <div>
            <label className="block text-xs font-semibold text-[#261C14] mb-1">
              Correo Electrónico de Administrador
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#261C14] mb-1">
              Contraseña de Acceso
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Validar Credenciales y Ver Reportes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E8DEC8]">
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="text-xs text-[#756353] hover:text-[#261C14] font-medium underline cursor-pointer"
          >
            Volver al Catálogo de Experiencias y Reservas
          </button>
        </div>
      </div>
    </div>
  );
};
