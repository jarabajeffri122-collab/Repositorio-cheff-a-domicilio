import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Users, 
  ChefHat, 
  Package, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { CartBookingItem, User } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartBookingItem[];
  currentUser: User;
  onUpdateQuantity: (experienceId: string, quantity: number) => void;
  onUpdateDetails: (experienceId: string, date: string, time: string, notes: string) => void;
  onRemoveItem: (experienceId: string) => void;
  onCheckout: (customerInfo: { name: string; email: string; eventDate: string; notes: string }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onUpdateDetails,
  onRemoveItem,
  onCheckout,
}) => {
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [defaultDate, setDefaultDate] = useState('2026-10-18');
  const [defaultTime, setDefaultTime] = useState('20:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, it) => acc + it.experience.price * it.guestsOrUnits,
    0
  );
  const tax = subtotal * 0.19; // IVA 19%
  const total = subtotal + tax;

  const totalItemsCount = cartItems.reduce((acc, it) => acc + it.guestsOrUnits, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onCheckout({
        name: customerName || currentUser.name,
        email: customerEmail || currentUser.email,
        eventDate: defaultDate,
        notes,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DEC8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C25E3E]/10 text-[#C25E3E] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#261C14]">
                  Carrito de Reservas
                </h3>
                <span className="text-[11px] text-[#756353]">
                  {cartItems.length} servicios o kits seleccionados
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#756353] hover:text-[#261C14] hover:bg-[#F3EDE4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#F3EDE4] text-[#756353] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif-display text-lg font-bold text-[#261C14]">
                  Sin reservas activas
                </h4>
                <p className="text-xs text-[#756353] mt-1 max-w-xs mx-auto">
                  Agrega experiencias de chef a domicilio o kits de especias artesanales de 150g para coordinar la fecha.
                </p>
              </div>
            ) : (
              cartItems.map((item) => {
                const lineTotal = item.experience.price * item.guestsOrUnits;
                const isMax = item.guestsOrUnits >= item.experience.availabilitySlots;

                return (
                  <div
                    key={item.experience.id}
                    className="p-4 rounded-xl bg-white border border-[#E8DEC8] shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.experience.imageUrl}
                        alt={item.experience.title}
                        className="w-16 h-16 rounded-lg object-cover border border-[#E8DEC8] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="font-semibold text-xs text-[#261C14] leading-snug truncate">
                            {item.experience.title}
                          </h5>
                          <button
                            onClick={() => onRemoveItem(item.experience.id)}
                            className="text-[#756353] hover:text-red-700 p-1 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[11px] text-[#4F5E3D] font-medium block mt-0.5">
                          {item.experience.occasion}
                        </span>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3EDE4]">
                          {/* Stepper */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQuantity(item.experience.id, item.guestsOrUnits - 1)}
                              className="w-6 h-6 rounded bg-[#FAF7F2] border border-[#E8DEC8] hover:bg-[#E8DEC8] flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold tabular-nums min-w-[2rem] text-center">
                              {item.guestsOrUnits} {item.experience.category === 'spice_kit' ? 'kits' : 'pers.'}
                            </span>
                            <button
                              disabled={isMax}
                              onClick={() => onUpdateQuantity(item.experience.id, item.guestsOrUnits + 1)}
                              className={`w-6 h-6 rounded border flex items-center justify-center font-bold text-xs cursor-pointer ${
                                isMax
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-[#FAF7F2] border-[#E8DEC8] hover:bg-[#E8DEC8]'
                              }`}
                            >
                              +
                            </button>
                          </div>

                          {/* Line price */}
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#261C14] tabular-nums block">
                              {formatCurrency(lineTotal)}
                            </span>
                            <span className="text-[10px] text-[#756353] tabular-nums">
                              {formatCurrency(item.experience.price)} / {item.experience.pricingLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service scheduling helper */}
                    {item.experience.category === 'chef_service' && (
                      <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E8DEC8] text-[11px] text-[#756353] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#C25E3E]" />
                        <span>Incluye cocinero privado, insumos de alta cocina y limpieza posterior.</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Form */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DEC8] space-y-4">
              {/* Financial Calculation */}
              <div className="space-y-1.5 text-xs text-[#756353]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#261C14] tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (IVA 19%)</span>
                  <span className="font-semibold text-[#261C14] tabular-nums">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#261C14] pt-2 border-t border-[#E8DEC8]">
                  <span>Total General</span>
                  <span className="text-[#9C4124] tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nombre del anfitrión / cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  />
                  <input
                    type="email"
                    placeholder="Correo de confirmación"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#756353] mb-0.5">Fecha del Evento</label>
                      <input
                        type="date"
                        value={defaultDate}
                        onChange={(e) => setDefaultDate(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#756353] mb-0.5">Hora Estimada</label>
                      <input
                        type="time"
                        value={defaultTime}
                        onChange={(e) => setDefaultTime(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2]"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Notas o alergias alimentarias..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-[11px] text-[#4F5E3D] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>La agenda del chef y el stock se reservarán de inmediato.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Confirmando Agenda y Cupos...</span>
                  ) : (
                    <>
                      <span>Confirmar Reserva / Checkout ({formatCurrency(total)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
