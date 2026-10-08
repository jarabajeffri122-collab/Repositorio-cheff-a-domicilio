import React from 'react';
import { X, Printer, CheckCircle, ChefHat, Calendar, Clock, MapPin } from 'lucide-react';
import { BookingRecord } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ReceiptModalProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8DEC8] shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Top bar */}
        <div className="p-4 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between no-print">
          <span className="text-xs font-semibold text-[#756353]">
            Comprobante Oficial de Reserva
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-[#261C14] hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C25E3E]" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#756353] hover:text-[#261C14] hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="p-8 overflow-y-auto space-y-6">
          <div className="text-center border-b border-[#E8DEC8] pb-6">
            <div className="w-12 h-12 rounded-full bg-[#C25E3E]/10 text-[#C25E3E] flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#261C14]">
              Chef en Casa · Experiencias Privadas
            </h3>
            <span className="text-[11px] uppercase tracking-widest text-[#756353] block">
              Confirmación de Servicio a Domicilio & Kits de Especias (150g)
            </span>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-mono">
              <span className="text-[#756353]">Reserva:</span>
              <strong className="text-[#9C4124]">{booking.id}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#756353] block text-[11px]">Anfitrión / Cliente:</span>
              <span className="font-semibold text-[#261C14]">{booking.customerName}</span>
              <span className="text-[#756353] block text-[11px]">{booking.customerEmail}</span>
            </div>
            <div className="text-right">
              <span className="text-[#756353] block text-[11px]">Fecha del Evento:</span>
              <span className="font-semibold text-[#261C14]">{booking.eventDate}</span>
              <span className="text-[#4F5E3D] font-medium block text-[11px]">
                Estado: {booking.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-[#261C14] block text-sm">{booking.experienceTitle}</span>
                <span className="text-[11px] text-[#9C4124] font-medium">{booking.occasion}</span>
              </div>
              <span className="font-bold text-sm text-[#261C14] tabular-nums">
                {formatCurrency(booking.total)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#756353] pt-2 border-t border-[#E8DEC8]">
              <span>Cantidad / Comensales: <strong>{booking.guestsOrUnits}</strong></span>
              {booking.notes && <span>Notas: <em>{booking.notes}</em></span>}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs text-[#756353] pt-2 border-t border-[#E8DEC8]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#261C14] tabular-nums">{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (IVA 19%):</span>
              <span className="font-semibold text-[#261C14] tabular-nums">{formatCurrency(booking.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#261C14] pt-2 border-t border-[#E8DEC8]">
              <span>Total Facturado:</span>
              <span className="text-[#9C4124] tabular-nums">{formatCurrency(booking.total)}</span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8] text-[11px] text-[#756353] flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-[#C25E3E] shrink-0" />
            <span>
              El chef asignado se pondrá en contacto 24 horas antes para coordinar el horario de llegada e instrucciones de acceso.
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DEC8] flex justify-end no-print">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#261C14] hover:bg-[#4A3C31] text-white text-xs font-semibold cursor-pointer"
          >
            Cerrar Comprobante
          </button>
        </div>
      </div>
    </div>
  );
};
