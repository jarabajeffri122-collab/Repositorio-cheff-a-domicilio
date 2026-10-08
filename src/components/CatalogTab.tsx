import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  ShieldCheck, 
  ChefHat, 
  Calendar, 
  Users, 
  UtensilsCrossed,
  Package,
  Clock,
  Plus
} from 'lucide-react';
import { ChefExperience, User, OccasionCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CatalogTabProps {
  experiences: ChefExperience[];
  currentUser: User;
  onAddToCart: (experience: ChefExperience) => void;
  onOpenEditModal: (experience: ChefExperience) => void;
  onOpenPhotoModal: (experience: ChefExperience) => void;
  onDeleteExperience: (id: string) => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({
  experiences,
  currentUser,
  onAddToCart,
  onOpenEditModal,
  onOpenPhotoModal,
  onDeleteExperience,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const occasionFilters = [
    { id: 'all', label: 'Todas las Ocasiones (10)' },
    { id: 'Cena Romántica / Aniversario', label: 'Cena Romántica' },
    { id: 'Reunión Familiar & Eventos', label: 'Reunión Familiar' },
    { id: 'Asado / BBQ Gourmet', label: 'Asado / BBQ Gourmet' },
    { id: 'Menú Degustación de Autor', label: 'Degustación de Autor' },
    { id: 'Ocasión Social & Amigos', label: 'Social & Amigos' },
    { id: 'Kits de Especias (150g)', label: 'Kits de Especias (150g)' },
  ];

  const filteredExperiences = experiences.filter((exp) => {
    const matchesFilter = selectedFilter === 'all' || exp.occasion === selectedFilter;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.chefName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = (exp: ChefExperience) => {
    onAddToCart(exp);
    setAddedItemNotification(exp.title);
    setTimeout(() => {
      setAddedItemNotification(null);
    }, 2800);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#261C14] to-[#4A3C31] text-[#FAF7F2] p-8 sm:p-12 border border-[#E8DEC8]">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-[#E88261] font-semibold">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Servicio Culinario Privado & Kits de Autor</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold leading-tight text-white mb-4">
            Chefs a Domicilio Diseñados para Cada Ocasión
          </h2>
          <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed mb-6">
            Transforme su hogar en un restaurante de alta gastronomía. Chefs ejecutivos acuden a su cocina con todos los ingredientes frescos, vajilla y mise en place, acompañados por nuestros exclusivos kits de especias de 150 gramos.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#FAF7F2]/90">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-xs">
              <ChefHat className="w-4 h-4 text-[#E88261]" />
              <span>Cocineros privados certificados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-xs">
              <Package className="w-4 h-4 text-[#E88261]" />
              <span>Kits de Especias en presentación de 150g</span>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-[#C25E3E]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Admin Mode Badge */}
      {currentUser.role === 'admin' && (
        <div className="p-3.5 rounded-xl bg-[#C25E3E]/10 border border-[#C25E3E]/30 flex items-center justify-between text-xs text-[#9C4124]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>Modo Administrador Activo:</strong> Puedes modificar datos, tarifas, cupos o reemplazar imágenes desde cada tarjeta.
            </span>
          </div>
          <span className="font-semibold text-[11px] underline">Controles directos</span>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#F3EDE4] rounded-xl border border-[#E8DEC8] no-scrollbar">
          {occasionFilters.map((filt) => (
            <button
              key={filt.id}
              onClick={() => setSelectedFilter(filt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === filt.id
                  ? 'bg-white text-[#9C4124] shadow-xs font-semibold'
                  : 'text-[#756353] hover:text-[#261C14] hover:bg-white/50'
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756353]" />
          <input
            type="text"
            placeholder="Buscar por chef, menú u ocasión..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8DEC8] bg-white focus:outline-none focus:border-[#C25E3E] transition-all"
          />
        </div>
      </div>

      {/* Floating Add Notification */}
      {addedItemNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#261C14] text-white px-5 py-3 rounded-xl shadow-lg border border-[#C25E3E]/40 flex items-center gap-3 animate-fade-in text-xs">
          <div className="w-6 h-6 rounded-full bg-[#4F5E3D] flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-white">Agregado al carrito de reservas</p>
            <p className="text-[11px] text-[#FAF7F2]/80 truncate max-w-xs">{addedItemNotification}</p>
          </div>
        </div>
      )}

      {/* Grid of Experiences and Spice Kits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperiences.map((exp) => {
          const isOutOfSlots = exp.availabilitySlots <= 0;

          return (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md group relative"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F3EDE4] to-[#E8DEC8] overflow-hidden flex items-center justify-center">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Occasion / Kit Badge */}
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E8DEC8] text-[11px] font-bold text-[#9C4124] shadow-xs flex items-center gap-1.5">
                  {exp.category === 'spice_kit' ? (
                    <Package className="w-3 h-3 text-[#C25E3E]" />
                  ) : (
                    <ChefHat className="w-3 h-3 text-[#4F5E3D]" />
                  )}
                  <span>{exp.occasion}</span>
                </div>

                {/* Slots Availability */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#E8DEC8] text-[11px] font-medium text-[#261C14] shadow-xs tabular-nums">
                  {isOutOfSlots ? (
                    <span className="text-red-700 font-bold">Sin fechas</span>
                  ) : (
                    <span>{exp.availabilitySlots} disponibles</span>
                  )}
                </div>

                {/* Admin Floating Controls */}
                {currentUser.role === 'admin' && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#261C14]/90 backdrop-blur-sm p-1.5 rounded-xl border border-white/20 shadow-md">
                    <button
                      onClick={() => onOpenPhotoModal(exp)}
                      title="Cambiar Foto"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenEditModal(exp)}
                      title="Editar Información"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la oferta "${exp.title}"?`)) {
                          onDeleteExperience(exp.id);
                        }
                      }}
                      title="Eliminar Referencia"
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#756353] mb-2 font-medium">
                    <span>{exp.chefName}</span>
                    {exp.estimatedDuration && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{exp.estimatedDuration}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-[#261C14] leading-snug mb-2 group-hover:text-[#9C4124] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-[#756353] leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  {exp.menuHighlights && exp.menuHighlights.length > 0 && (
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DEC8] text-[11px] text-[#4A3C31] mb-4 space-y-1">
                      <span className="font-semibold text-[#9C4124] block mb-1">
                        {exp.category === 'spice_kit' ? 'Contenido del kit (150g c/u):' : 'Menú y platos destacados:'}
                      </span>
                      {exp.menuHighlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-[#C25E3E] font-bold">•</span>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Action Section */}
                <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#756353] block">
                      Tarifa ({exp.pricingLabel})
                    </span>
                    <span className="text-lg font-bold text-[#261C14] tabular-nums">
                      {formatCurrency(exp.price)}
                    </span>
                  </div>

                  <button
                    disabled={isOutOfSlots}
                    onClick={() => handleAdd(exp)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                      isOutOfSlots
                        ? 'bg-[#E8DEC8] text-[#756353] cursor-not-allowed'
                        : 'bg-[#C25E3E] hover:bg-[#9C4124] active:scale-95 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isOutOfSlots ? 'Sin cupos' : 'Reservar / Agregar'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DEC8]">
          <p className="text-sm text-[#756353]">No se encontraron experiencias con los criterios actuales.</p>
          <button
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-[#9C4124] font-semibold underline cursor-pointer"
          >
            Ver todas las ofertas
          </button>
        </div>
      )}
    </div>
  );
};
