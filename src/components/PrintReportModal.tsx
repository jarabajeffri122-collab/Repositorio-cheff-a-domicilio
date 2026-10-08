import React from 'react';
import { X, Printer, FileText, ChefHat } from 'lucide-react';
import { ChefExperience, BookingRecord } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiences: ChefExperience[];
  bookings: BookingRecord[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  experiences,
  bookings,
}) => {
  if (!isOpen) return null;

  const totalSlots = experiences.reduce((acc, exp) => acc + exp.availabilitySlots, 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + b.total, 0);
  const totalTaxes = bookings.reduce((acc, b) => acc + b.tax, 0);
  const averageTicket = bookings.length > 0 ? totalRevenue / bookings.length : 0;
  const uniqueCustomers = new Set(bookings.map((b) => b.customerEmail.toLowerCase().trim())).size;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8DEC8] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="p-4 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C25E3E]" />
            <span className="text-xs font-bold text-[#261C14]">
              Vista Previa de Informe Ejecutivo Culinario (PDF)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-[#C25E3E] hover:bg-[#9C4124] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#756353] hover:text-[#261C14] hover:bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white text-[#261C14]">
          <div className="flex items-start justify-between border-b-2 border-[#261C14] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C25E3E]/10 border border-[#C25E3E]/40 flex items-center justify-center text-[#C25E3E]">
                <ChefHat className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-serif-display text-3xl font-bold text-[#261C14]">
                  Chef en Casa
                </h1>
                <p className="text-xs text-[#756353]">
                  Experiencias Gastronómicas Privadas & Kits de Autor (150g)
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono text-[#9C4124] font-bold block">
                INFORME EJECUTIVO DE RESERVAS
              </span>
              <span className="text-[#756353] block">
                Fecha: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#756353] font-bold mb-3">
              Indicadores Clave del Negocio
            </h2>
            <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs">
              <div>
                <span className="text-[#756353] block text-[11px]">Cupos / Stock</span>
                <span className="text-lg font-bold text-[#261C14]">{totalSlots} disponibles</span>
                <span className="text-[10px] text-[#4F5E3D] block">{experiences.length} experiencias activas</span>
              </div>
              <div>
                <span className="text-[#756353] block text-[11px]">Clientes Únicos</span>
                <span className="text-lg font-bold text-[#261C14]">{uniqueCustomers}</span>
                <span className="text-[10px] text-[#756353] block">Anfitriones registrados</span>
              </div>
              <div>
                <span className="text-[#756353] block text-[11px]">Facturación Total</span>
                <span className="text-lg font-bold text-[#9C4124]">{formatCurrency(totalRevenue)}</span>
                <span className="text-[10px] text-[#756353] block">IVA: {formatCurrency(totalTaxes)}</span>
              </div>
              <div>
                <span className="text-[#756353] block text-[11px]">Promedio por Reserva</span>
                <span className="text-lg font-bold text-[#261C14]">{formatCurrency(averageTicket)}</span>
                <span className="text-[10px] text-[#756353] block">{bookings.length} eventos</span>
              </div>
            </div>
          </div>

          {/* Offerings table */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#756353] font-bold mb-3">
              Catálogo de Servicios y Kits
            </h2>
            <table className="w-full text-xs text-left border border-[#E8DEC8]">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DEC8] text-[10px] uppercase text-[#756353]">
                <tr>
                  <th className="py-2 px-3">Título</th>
                  <th className="py-2 px-3">Ocasión</th>
                  <th className="py-2 px-3">Chef / Línea</th>
                  <th className="py-2 px-3 text-right">Tarifa</th>
                  <th className="py-2 px-3 text-right">Cupos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DEC8]">
                {experiences.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-2 px-3 font-semibold">{exp.title}</td>
                    <td className="py-2 px-3 text-[#4F5E3D]">{exp.occasion}</td>
                    <td className="py-2 px-3 text-[#756353]">{exp.chefName}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(exp.price)} ({exp.pricingLabel})</td>
                    <td className="py-2 px-3 text-right font-bold tabular-nums">{exp.availabilitySlots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bookings table */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#756353] font-bold mb-3">
              Registro de Reservas y Ventas
            </h2>
            <table className="w-full text-xs text-left border border-[#E8DEC8]">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DEC8] text-[10px] uppercase text-[#756353]">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Cliente</th>
                  <th className="py-2 px-3">Fecha Evento</th>
                  <th className="py-2 px-3">Experiencia</th>
                  <th className="py-2 px-3 text-center">Pers./U.</th>
                  <th className="py-2 px-3 text-right">Total Facturado</th>
                  <th className="py-2 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DEC8]">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2 px-3 font-mono font-semibold">{b.id}</td>
                    <td className="py-2 px-3">{b.customerName}</td>
                    <td className="py-2 px-3 text-[#756353]">{b.eventDate}</td>
                    <td className="py-2 px-3 max-w-xs truncate">{b.experienceTitle}</td>
                    <td className="py-2 px-3 text-center font-bold">{b.guestsOrUnits}</td>
                    <td className="py-2 px-3 text-right font-bold tabular-nums">{formatCurrency(b.total)}</td>
                    <td className="py-2 px-3 text-center text-[10px] font-semibold">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-8 border-t border-[#E8DEC8] text-xs text-[#756353] flex justify-between items-end">
            <div>
              <p className="font-semibold text-[#261C14]">Dirección de Operaciones Culinarias</p>
              <p>Chef en Casa · Red de Cocineros Privados & Boutique 150g</p>
            </div>
            <div className="border-t border-[#261C14] w-48 text-center pt-2">
              <span className="block font-serif-display font-bold text-sm text-[#261C14]">Helena Valdés</span>
              <span className="text-[10px]">Directora Culinaria Ejecutiva</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
