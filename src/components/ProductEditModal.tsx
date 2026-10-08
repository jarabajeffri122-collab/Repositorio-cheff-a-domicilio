import React, { useState, useEffect } from 'react';
import { X, Save, ChefHat, Calendar } from 'lucide-react';
import { ChefExperience, OccasionCategory } from '../types';

interface ProductEditModalProps {
  experience: ChefExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ChefExperience) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !experience) return null;

  const [title, setTitle] = useState(experience.title);
  const [chefName, setChefName] = useState(experience.chefName);
  const [occasion, setOccasion] = useState<OccasionCategory>(experience.occasion);
  const [description, setDescription] = useState(experience.description);
  const [price, setPrice] = useState(experience.price);
  const [availabilitySlots, setAvailabilitySlots] = useState(experience.availabilitySlots);
  const [pricingLabel, setPricingLabel] = useState(experience.pricingLabel);

  useEffect(() => {
    if (experience) {
      setTitle(experience.title);
      setChefName(experience.chefName);
      setOccasion(experience.occasion);
      setDescription(experience.description);
      setPrice(experience.price);
      setAvailabilitySlots(experience.availabilitySlots);
      setPricingLabel(experience.pricingLabel);
    }
  }, [experience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...experience,
      title,
      chefName,
      occasion,
      description,
      price: Number(price),
      availabilitySlots: Number(availabilitySlots),
      pricingLabel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8DEC8] shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in">
        <div className="p-6 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9C4124] font-bold">
              Edición Administrativa
            </span>
            <h3 className="font-serif-display text-2xl font-bold text-[#261C14]">
              Editar Oferta Culinaria
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#756353] hover:text-[#261C14] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#261C14] mb-1">
              Título de la Experiencia / Plato
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#261C14] mb-1">
                Chef a Cargo / Colección
              </label>
              <input
                type="text"
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#261C14] mb-1">
                Ocasión
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as OccasionCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
              >
                <option value="Cena Romántica / Aniversario">Cena Romántica / Aniversario</option>
                <option value="Reunión Familiar & Eventos">Reunión Familiar & Eventos</option>
                <option value="Asado / BBQ Gourmet">Asado / BBQ Gourmet</option>
                <option value="Menú Degustación de Autor">Menú Degustación de Autor</option>
                <option value="Ocasión Social & Amigos">Ocasión Social & Amigos</option>
                <option value="Kits de Especias (150g)">Kits de Especias (150g)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#261C14] mb-1">
                Precio (€ / $)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#261C14] mb-1">
                Disponibilidad / Cupos
              </label>
              <input
                type="number"
                min="0"
                value={availabilitySlots}
                onChange={(e) => setAvailabilitySlots(parseInt(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#261C14] mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            />
          </div>

          <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#756353] hover:text-[#261C14] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
