import { BookingRecord } from '../types';

export function exportBookingsToExcelCSV(bookings: BookingRecord[]) {
  const BOM = '\uFEFF';

  const headers = [
    'ID Reserva',
    'Cliente',
    'Email',
    'Fecha del Evento',
    'Experiencia / Producto Contratado',
    'Tipo de Ocasión',
    'Tipo de Ítem',
    'Personas / Unidades',
    'Subtotal ($ COP)',
    'IVA 19% ($ COP)',
    'Total Facturado ($ COP)',
    'Estado',
    'Notas Especiales',
  ];

  const rows = bookings.map((b) => {
    return [
      `"${b.id}"`,
      `"${b.customerName.replace(/"/g, '""')}"`,
      `"${b.customerEmail}"`,
      `"${b.eventDate}"`,
      `"${b.experienceTitle.replace(/"/g, '""')}"`,
      `"${b.occasion}"`,
      b.isSpiceKit ? '"Kit de Especias (150g)"' : '"Servicio Chef a Domicilio"',
      b.guestsOrUnits,
      b.subtotal.toFixed(2),
      b.tax.toFixed(2),
      b.total.toFixed(2),
      `"${b.status}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ].join(';');
  });

  const totalGuests = bookings.reduce((acc, b) => acc + b.guestsOrUnits, 0);
  const totalSubtotal = bookings.reduce((acc, b) => acc + b.subtotal, 0);
  const totalTax = bookings.reduce((acc, b) => acc + b.tax, 0);
  const grandTotal = bookings.reduce((acc, b) => acc + b.total, 0);

  const summaryRow = [
    '"TOTALES"',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    totalGuests,
    totalSubtotal.toFixed(2),
    totalTax.toFixed(2),
    grandTotal.toFixed(2),
    '""',
    '""',
  ].join(';');

  const csvContent = BOM + [headers.join(';'), ...rows, summaryRow].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `Reservas_Chef_a_Domicilio_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
