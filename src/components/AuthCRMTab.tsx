import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  PlusCircle, 
  ChefHat, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  ArrowRight,
  Calendar,
  UtensilsCrossed,
  Package
} from 'lucide-react';
import { User, UserRole, ChefExperience, OccasionCategory } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CHEF_PRESET_GALLERY } from '../assets/images';

interface AuthCRMTabProps {
  currentUser: User;
  onLogin: (user: User) => void;
  experiences: ChefExperience[];
  onAddExperience: (exp: Omit<ChefExperience, 'id'>) => void;
  onUpdateExperience: (exp: ChefExperience) => void;
  onDeleteExperience: (id: string) => void;
  onOpenEditModal: (exp: ChefExperience) => void;
  onOpenPhotoModal: (exp: ChefExperience) => void;
  onNavigateToCatalog: () => void;
}

export const AuthCRMTab: React.FC<AuthCRMTabProps> = ({
  currentUser,
  onLogin,
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onOpenEditModal,
  onOpenPhotoModal,
  onNavigateToCatalog,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [emailInput, setEmailInput] = useState(currentUser.role === 'admin' ? 'jeffrijaraba@chefprivado.com' : currentUser.email);
  const [passwordInput, setPasswordInput] = useState(currentUser.role === 'admin' ? '3008615272' : 'cliente123');
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  // Form states for new experience
  const [title, setTitle] = useState('');
  const [chefName, setChefName] = useState('');
  const [occasion, setOccasion] = useState<OccasionCategory>('Cena Romántica / Aniversario');
  const [category, setCategory] = useState<'chef_service' | 'spice_kit'>('chef_service');
  const [description, setDescription] = useState('');
  const [menuHighlightsText, setMenuHighlightsText] = useState('');
  const [price, setPrice] = useState<number>(180000);
  const [pricingLabel, setPricingLabel] = useState<'por persona' | 'por evento' | 'por kit 150g'>('por persona');
  const [availabilitySlots, setAvailabilitySlots] = useState<number>(8);
  const [imageUrl, setImageUrl] = useState(CHEF_PRESET_GALLERY[0].url);
  const [addSuccessMsg, setAddSuccessMsg] = useState(false);

  const PRESETS = CHEF_PRESET_GALLERY;

  const handleRoleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmailInput('jeffrijaraba@chefprivado.com');
      setPasswordInput('3008615272');
      onLogin({
        id: 'usr-admin-01',
        name: 'Jeffri Jaraba (Administrador Ejecutivo)',
        email: 'jeffrijaraba@chefprivado.com',
        role: 'admin',
        phone: '+57 312 889 1234',
        address: 'Atelier de Alta Cocina, Bogotá D.C.',
      });
      setLoginFeedback('Sesión iniciada con éxito como Administrador');
    } else {
      setEmailInput('cliente@chefencasa.com');
      setPasswordInput('cliente123');
      onLogin({
        id: 'usr-client-01',
        name: 'Carlos Mendoza (Gourmet Sommelier)',
        email: 'cliente@chefencasa.com',
        role: 'cliente',
        phone: '+57 301 654 3210',
        address: 'Calle 93 #14-20, Chicó Norte, Bogotá D.C.',
      });
      setLoginFeedback('Sesión iniciada con éxito como Comprador / Cliente');
    }
    setTimeout(() => setLoginFeedback(null), 3000);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      const emailLower = emailInput.trim().toLowerCase();
      if (
        (emailLower === 'jeffrijaraba@chefprivado.com' && passwordInput === '3008615272') ||
        (emailLower === 'jeffrijaraba122@gmail.com' && passwordInput === 'Emiliano2002*') ||
        (emailLower === 'admin@chefencasa.com' && passwordInput === 'admin123')
      ) {
        onLogin({
          id: 'usr-admin-01',
          name: 'Jeffri Jaraba (Administrador Ejecutivo)',
          email: 'jeffrijaraba@chefprivado.com',
          role: 'admin',
          phone: '+57 312 889 1234',
          address: 'Atelier de Alta Cocina, Bogotá D.C.',
        });
        setLoginFeedback('Acceso concedido como Administrador');
      } else {
        setLoginFeedback('Credenciales incorrectas para Admin. Use: jeffrijaraba@chefprivado.com / 3008615272');
      }
    } else {
      if (emailInput.trim().toLowerCase() === 'cliente@chefencasa.com' && passwordInput === 'cliente123') {
        onLogin({
          id: 'usr-client-01',
          name: 'Carlos Mendoza (Gourmet Sommelier)',
          email: 'cliente@chefencasa.com',
          role: 'cliente',
        });
        setLoginFeedback('Acceso concedido como Cliente');
      } else {
        setLoginFeedback('Credenciales incorrectas para Cliente. Use: cliente@chefencasa.com / cliente123');
      }
    }
    setTimeout(() => setLoginFeedback(null), 3500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const highlights = menuHighlightsText
      ? menuHighlightsText.split('\n').filter((l) => l.trim().length > 0)
      : ['Menú personalizado según preferencias del anfitrión', 'Mise en place y servicio completo en vajilla de autor'];

    onAddExperience({
      title,
      chefName: chefName.trim() || 'Chef Sommelier Ejecutivo',
      occasion,
      category,
      description,
      menuHighlights: highlights,
      price: Number(price),
      pricingLabel: category === 'spice_kit' ? 'por kit 150g' : pricingLabel,
      availabilitySlots: Number(availabilitySlots),
      imageUrl,
    });

    setAddSuccessMsg(true);
    setTitle('');
    setChefName('');
    setDescription('');
    setMenuHighlightsText('');
    setPrice(95);
    setAvailabilitySlots(8);
    setTimeout(() => setAddSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: AUTHENTICATION AND ROLE SELECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#9C4124] font-semibold">
              Control de Accesos & Roles Culinarios
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#261C14] mt-1">
              CRM y Acceso de Usuarios
            </h2>
            <p className="text-sm text-[#756353] mt-2 max-w-xl mx-auto">
              Acceso a la plataforma de gestión de chefs privados, reservas por ocasión y catálogo de kits de autor en presentación de 150g.
            </p>
          </div>

          {/* Quick Demo Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: Admin */}
            <div
              onClick={() => handleRoleQuickSelect('admin')}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer relative ${
                currentUser.role === 'admin'
                  ? 'border-[#C25E3E] bg-[#FAF7F2] shadow-sm'
                  : 'border-[#E8DEC8] bg-[#FAF7F2]/40 hover:border-[#C25E3E]/60'
              }`}
            >
              {currentUser.role === 'admin' && (
                <span className="absolute top-4 right-4 bg-[#C25E3E] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Activo
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#C25E3E]/10 text-[#C25E3E] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#261C14]">Perfil 1: Administrador</h3>
                  <span className="text-xs text-[#756353]">Gestión de chefs, fechas y catálogo</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E8DEC8] text-xs font-mono space-y-1 text-[#261C14]">
                <div><span className="text-[#756353]">Acceso:</span> jeffrijaraba@chefprivado.com</div>
                <div><span className="text-[#756353]">Clave:</span> 3008615272</div>
              </div>
              <p className="text-xs text-[#756353] mt-3">
                Permite agregar experiencias, fijar precios por persona/evento, gestionar cupos y modificar fotos.
              </p>
              <button
                type="button"
                className="mt-4 w-full py-2 px-3 rounded-lg bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Acceder como Administrador (1 Clic)
              </button>
            </div>

            {/* Card 2: Cliente */}
            <div
              onClick={() => handleRoleQuickSelect('cliente')}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer relative ${
                currentUser.role === 'cliente'
                  ? 'border-[#4F5E3D] bg-[#FAF7F2] shadow-sm'
                  : 'border-[#E8DEC8] bg-[#FAF7F2]/40 hover:border-[#4F5E3D]/60'
              }`}
            >
              {currentUser.role === 'cliente' && (
                <span className="absolute top-4 right-4 bg-[#4F5E3D] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Activo
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#4F5E3D]/10 text-[#4F5E3D] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#261C14]">Perfil 2: Comprador / Cliente</h3>
                  <span className="text-xs text-[#756353]">Exploración y reserva de chefs</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E8DEC8] text-xs font-mono space-y-1 text-[#261C14]">
                <div><span className="text-[#756353]">Acceso:</span> cliente@chefencasa.com</div>
                <div><span className="text-[#756353]">Clave:</span> cliente123</div>
              </div>
              <p className="text-xs text-[#756353] mt-3">
                Exploración de menús por ocasión, selección de fechas para el chef y kits de especias exclusivos.
              </p>
              <button
                type="button"
                className="mt-4 w-full py-2 px-3 rounded-lg bg-[#4F5E3D] hover:bg-[#39452C] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Acceder como Cliente (1 Clic)
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="border-t border-[#E8DEC8] pt-6 mt-6">
            <h4 className="text-xs uppercase font-semibold text-[#756353] tracking-wider mb-4 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#9C4124]" />
              Formulario de Acceso Manual
            </h4>
            <form onSubmit={handleManualLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-[#261C14] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#261C14] mb-1">Contraseña</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#261C14] text-white hover:bg-[#4A3C31] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            {loginFeedback && (
              <div className="mt-4 p-3 rounded-lg bg-[#FAF7F2] border border-[#C25E3E]/40 text-xs text-[#9C4124] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginFeedback}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: VIEW ACCORDING TO CURRENT ROLE */}
      {currentUser.role === 'admin' ? (
        /* ================= ADMIN VIEW ================= */
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#C25E3E]/10 rounded-2xl border border-[#C25E3E]/20">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C25E3E]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#9C4124]">
                  Panel de Gestión Culinaria y Menús
                </span>
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#261C14] mt-1">
                Administración de Servicios de Chefs y Kits de Especias
              </h3>
              <p className="text-xs text-[#756353] mt-0.5">
                Sesión: {currentUser.name} ({currentUser.email})
              </p>
            </div>
            <button
              onClick={onNavigateToCatalog}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C25E3E] text-white hover:bg-[#9C4124] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Ver Catálogo de Reservas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Form to Add New Experience / Chef Service / Spice Kit */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DEC8]">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#261C14] flex items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-[#C25E3E]" />
                  Agregar Nueva Oferta: Servicio de Chef o Kit de Especias
                </h3>
                <p className="text-xs text-[#756353] mt-1">
                  Configure menús de autor por ocasión, tarifas y disponibilidad de agenda o inventario.
                </p>
              </div>
            </div>

            {addSuccessMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Oferta gastronómica publicada exitosamente en el catálogo en vivo!</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#261C14] mb-1">
                    Título de la Experiencia / Producto <span className="text-[#9C4124]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Chef Privado: Noche de Tapas y Arroces de Autor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261C14] mb-1">
                    Nombre del Chef a Cargo / Línea Gourmet
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Chef Daniel Osorio"
                    value={chefName}
                    onChange={(e) => setChefName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261C14] mb-1">Tipo de Ocasión</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as OccasionCategory)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  >
                    <option value="Cena Romántica / Aniversario">Cena Romántica / Aniversario</option>
                    <option value="Reunión Familiar & Eventos">Reunión Familiar & Eventos</option>
                    <option value="Asado / BBQ Gourmet">Asado / BBQ Gourmet</option>
                    <option value="Menú Degustación de Autor">Menú Degustación de Autor</option>
                    <option value="Ocasión Social & Amigos">Ocasión Social & Amigos</option>
                    <option value="Kits de Especias (150g)">Kits de Especias (150g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261C14] mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'chef_service' | 'spice_kit')}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  >
                    <option value="chef_service">Servicio de Chef Privado a Domicilio</option>
                    <option value="spice_kit">Kit de Especias de Autor (150g)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#261C14] mb-1">
                      Precio (€ / $) <span className="text-[#9C4124]">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#261C14] mb-1">
                      Cupos / Disponibilidad <span className="text-[#9C4124]">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={availabilitySlots}
                      onChange={(e) => setAvailabilitySlots(parseInt(e.target.value) || 1)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E] tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261C14] mb-1">
                    Modalidad de Cobro
                  </label>
                  <select
                    value={pricingLabel}
                    onChange={(e) => setPricingLabel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  >
                    <option value="por persona">Por Persona</option>
                    <option value="por evento">Por Evento Completo</option>
                    <option value="por kit 150g">Por Kit de Especias (150g)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#261C14] mb-1">
                  Descripción Gastronómica <span className="text-[#9C4124]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la preparación, servicio de mesa, maridajes o perfil aromático..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#261C14] mb-1">
                  Platos del Menú / Puntos Clave (1 por línea)
                </label>
                <textarea
                  rows={3}
                  placeholder="Entrante: Tartar de salmón...&#10;Plato Fuerte: Solomillo de vaca...&#10;Postre: Coulant de chocolate..."
                  value={menuHighlightsText}
                  onChange={(e) => setMenuHighlightsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                />
              </div>

              {/* Image selector */}
              <div>
                <label className="block text-xs font-semibold text-[#261C14] mb-1">
                  URL de Imagen Representativa
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                />
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-[#756353] block mb-2">
                    Seleccionar fotografía de alta calidad disponible:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(p.url)}
                        className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
                          imageUrl === p.url
                            ? 'border-[#C25E3E] bg-[#C25E3E]/10 font-medium text-[#9C4124]'
                            : 'border-[#E8DEC8] hover:border-[#C25E3E]/40 text-[#756353]'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-6 h-6 rounded object-cover" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar en Catálogo de Reservas</span>
                </button>
              </div>
            </form>
          </section>

          {/* Quick Management Table */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DEC8]">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#261C14]">
                  Gestión Rápida de Servicios y Kits
                </h3>
                <p className="text-xs text-[#756353] mt-1">
                  Modifique cupos de agenda, tarifas o imágenes de cada experiencia activa.
                </p>
              </div>
              <span className="text-xs text-[#756353]">
                Total Activos: <strong className="text-[#261C14]">{experiences.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DEC8] text-[#756353] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Experiencia / Producto</th>
                    <th className="py-3 px-3">Ocasión</th>
                    <th className="py-3 px-3">Precio / Modalidad</th>
                    <th className="py-3 px-3">Disponibilidad / Cupos</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC8]">
                  {experiences.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={exp.imageUrl}
                            alt={exp.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E8DEC8] shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-sm text-[#261C14] block">{exp.title}</span>
                            <span className="text-[11px] text-[#756353]">{exp.chefName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#4F5E3D]">
                        {exp.occasion}
                      </td>
                      <td className="py-3 px-3 font-semibold text-sm text-[#261C14] tabular-nums">
                        {formatCurrency(exp.price)} <span className="text-[11px] font-normal text-[#756353]">({exp.pricingLabel})</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onUpdateExperience({
                                ...exp,
                                availabilitySlots: Math.max(0, exp.availabilitySlots - 1),
                              });
                            }}
                            className="w-6 h-6 rounded bg-[#FAF7F2] border border-[#E8DEC8] hover:bg-[#E8DEC8] flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold tabular-nums min-w-[2rem] text-center text-sm">
                            {exp.availabilitySlots}
                          </span>
                          <button
                            onClick={() => {
                              onUpdateExperience({
                                ...exp,
                                availabilitySlots: exp.availabilitySlots + 1,
                              });
                            }}
                            className="w-6 h-6 rounded bg-[#FAF7F2] border border-[#E8DEC8] hover:bg-[#E8DEC8] flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                          <span className="text-[11px] text-[#756353]">fechas/kits</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenPhotoModal(exp)}
                            title="Cambiar Foto"
                            className="p-1.5 rounded-lg text-[#756353] hover:text-[#9C4124] hover:bg-[#C25E3E]/10 cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(exp)}
                            title="Editar Datos"
                            className="p-1.5 rounded-lg text-[#756353] hover:text-[#9C4124] hover:bg-[#C25E3E]/10 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la experiencia "${exp.title}"?`)) {
                                onDeleteExperience(exp.id);
                              }
                            }}
                            title="Eliminar"
                            className="p-1.5 rounded-lg text-[#756353] hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        /* ================= CLIENT VIEW ================= */
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E8DEC8]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#4F5E3D]/10 border border-[#4F5E3D]/30 text-[#4F5E3D] flex items-center justify-center font-bold text-xl">
                  CM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#4F5E3D]" />
                    <span className="text-xs uppercase tracking-wider text-[#4F5E3D] font-bold">
                      Cliente Registrado · Miembro Sommelier
                    </span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#261C14] mt-0.5">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-[#756353]">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={onNavigateToCatalog}
                className="py-3 px-6 rounded-xl bg-[#4F5E3D] hover:bg-[#39452C] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Explorar Experiencias y Menús</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
                <span className="text-[11px] uppercase tracking-wider text-[#756353] font-semibold block mb-1">
                  Dirección para Eventos Privados
                </span>
                <p className="text-xs text-[#261C14] font-medium">
                  {currentUser.address || 'Residencial Las Acacias 14, Barcelona'}
                </p>
                <p className="text-xs text-[#756353] mt-1">{currentUser.phone || '+34 654 321 987'}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
                <span className="text-[11px] uppercase tracking-wider text-[#756353] font-semibold block mb-1">
                  Garantía del Servicio de Chef
                </span>
                <p className="text-xs text-[#261C14]">
                  Ingredientes frescos de temporada, vajilla selecta, preparación in situ y limpieza total de cocina al culminar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
                <span className="text-[11px] uppercase tracking-wider text-[#756353] font-semibold block mb-1">
                  Kits de Especias de Autor (150g)
                </span>
                <p className="text-xs text-[#4F5E3D] font-medium">
                  ✓ Descuento exclusivo del 15% en compras complementarias
                </p>
                <p className="text-xs text-[#756353] mt-0.5">
                  ✓ Frascos herméticos de vidrio ámbar y corcho
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
