import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ChefExperience } from '../types';
import { CHEF_PRESET_GALLERY } from '../assets/images';

interface ChangePhotoModalProps {
  experience: ChefExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (id: string, newUrl: string) => void;
}

export const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSavePhoto,
}) => {
  if (!isOpen || !experience) return null;

  const [imageUrl, setImageUrl] = useState(experience.imageUrl);

  useEffect(() => {
    if (experience) {
      setImageUrl(experience.imageUrl);
    }
  }, [experience]);

  const PRESETS = CHEF_PRESET_GALLERY;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSavePhoto(experience.id, imageUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8DEC8] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="p-6 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9C4124] font-bold">
              Gestor Multimedia
            </span>
            <h3 className="font-serif-display text-2xl font-bold text-[#261C14]">
              Reemplazar Imagen de Oferta
            </h3>
            <p className="text-xs text-[#756353]">{experience.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#756353] hover:text-[#261C14] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
            <img
              src={imageUrl}
              alt="Vista previa"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-lg object-cover border border-[#E8DEC8] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/chef_pasta_italiana_1791337995157.jpg';
              }}
            />
            <div>
              <span className="text-xs font-semibold text-[#261C14] block">Vista previa activa</span>
              <span className="text-[11px] text-[#756353] block mt-0.5">
                Fotografía representativa visible en catálogo y ficha de reserva.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#261C14] mb-1">
              URL de la Fotografía
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#261C14] block mb-2">
              Galería de Fotografías Gastronómicas:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(item.url)}
                  className={`p-2 rounded-lg border text-left text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    imageUrl === item.url
                      ? 'border-[#C25E3E] bg-[#C25E3E]/10 text-[#9C4124] font-medium'
                      : 'border-[#E8DEC8] hover:border-[#C25E3E]/40 text-[#756353]'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-8 h-8 rounded object-cover" />
                  <span className="text-[11px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
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
              <Check className="w-4 h-4" />
              <span>Confirmar Imagen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
