import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  ChefHat, 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  FileSpreadsheet, 
  Search, 
  Eye, 
  Calendar, 
  Package, 
  UtensilsCrossed 
} from 'lucide-react';
import { ChefExperience, BookingRecord, OccasionCategory } from '../types';
import { formatCurrency } from '../utils/formatters';
import { exportBookingsToExcelCSV } from '../utils/exportUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardTabProps {
  experiences: ChefExperience[];
  bookings: BookingRecord[];
  onOpenReceipt: (booking: BookingRecord) => void;
  onOpenPrintReport: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  experiences,
  bookings,
  onOpenReceipt,
  onOpenPrintReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [occasionFilter, setOccasionFilter] = useState<string>('all');

  // KPI 1: Total available slots and inventory
  const totalSlotsAvailable = useMemo(() => {
    return experiences.reduce((acc, exp) => acc + exp.availabilitySlots, 0);
  }, [experiences]);

  // KPI 2: Unique customers
  const uniqueCustomersCount = useMemo(() => {
    const customerSet = new Set(bookings.map((b) => b.customerEmail.toLowerCase().trim()));
    return customerSet.size;
  }, [bookings]);

  // KPI 3: Total billed
  const totalRevenue = useMemo(() => {
    return bookings.reduce((acc, b) => acc + b.total, 0);
  }, [bookings]);

  // KPI 4: Average ticket per booking
  const averageTicket = useMemo(() => {
    return bookings.length > 0 ? totalRevenue / bookings.length : 0;
  }, [bookings, totalRevenue]);

  // Bar Chart: Most booked experiences / dishes by occasion
  const barChartData = useMemo(() => {
    const occasionCount: Record<string, number> = {};

    bookings.forEach((b) => {
      occasionCount[b.occasion] = (occasionCount[b.occasion] || 0) + b.guestsOrUnits;
    });

    const labels = Object.keys(occasionCount);
    const data = Object.values(occasionCount);

    return {
      labels: labels.map((l) => l.split('/')[0].trim()),
      datasets: [
        {
          label: 'Personas / Unidades Contratadas',
          data,
          backgroundColor: '#C25E3E',
          hoverBackgroundColor: '#9C4124',
          borderRadius: 6,
        },
      ],
    };
  }, [bookings]);

  // Line Chart: Trend over time
  const lineChartData = useMemo(() => {
    const dateRevenue: Record<string, number> = {};
    const sorted = [...bookings].sort((a, b) => a.eventDate.localeCompare(b.eventDate));

    sorted.forEach((b) => {
      dateRevenue[b.eventDate] = (dateRevenue[b.eventDate] || 0) + b.total;
    });

    const labels = Object.keys(dateRevenue);
    const data = Object.values(dateRevenue);

    return {
      labels,
      datasets: [
        {
          label: 'Facturación (€)',
          data,
          fill: true,
          borderColor: '#4F5E3D',
          backgroundColor: 'rgba(79, 94, 61, 0.12)',
          tension: 0.35,
          pointBackgroundColor: '#4F5E3D',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [bookings]);

  // Doughnut Chart: Distribution by occasion category
  const donutChartData = useMemo(() => {
    const counts: Record<string, number> = {};

    bookings.forEach((b) => {
      counts[b.occasion] = (counts[b.occasion] || 0) + b.total;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const palette = [
      '#C25E3E', // Terracotta
      '#4F5E3D', // Olive
      '#D49A3D', // Ochre
      '#8A422D', // Clay
      '#39452C', // Forest Olive
      '#A37B57', // Linen Warm
    ];

    return {
      labels: labels.map((l) => l.split('/')[0].trim()),
      datasets: [
        {
          data,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderWidth: 2,
          borderColor: '#FAF7F2',
        },
      ],
    };
  }, [bookings]);

  // Filtered Bookings Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.experienceTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesOccasion = occasionFilter === 'all' || b.occasion === occasionFilter;

      return matchesSearch && matchesStatus && matchesOccasion;
    });
  }, [bookings, searchTerm, statusFilter, occasionFilter]);

  return (
    <div className="space-y-10">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DEC8]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#9C4124]">
            Panel Gerencial Culinario
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#261C14] mt-1">
            Dashboard de Analítica, Inventario y Reportes
          </h2>
          <p className="text-xs text-[#756353] mt-1">
            Métricas de contratación de chefs a domicilio, agendas activas y ventas de kits de especias (150g).
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPrintReport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E8DEC8] hover:bg-[#FAF7F2] text-[#261C14] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#C25E3E]" />
            <span>Descargar Informe PDF</span>
          </button>

          <button
            onClick={() => exportBookingsToExcelCSV(bookings)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#4F5E3D] hover:bg-[#39452C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#FAF7F2]" />
            <span>Descargar Informe Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 1. Metric Cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#756353]">
              Cupos / Stock Total
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C25E3E]/10 text-[#C25E3E] flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#261C14] tabular-nums">
              {totalSlotsAvailable}
            </span>
            <span className="text-xs font-semibold text-[#756353]">disponibles</span>
          </div>
          <div className="mt-2 text-[11px] text-[#4F5E3D] font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fechas de chef & kits 150g en bodega</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#756353]">
              Clientes Únicos
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#4F5E3D]/10 text-[#4F5E3D] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#261C14] tabular-nums">
              {uniqueCustomersCount}
            </span>
            <span className="text-xs font-semibold text-[#756353]">anfitriones</span>
          </div>
          <div className="mt-2 text-[11px] text-[#756353]">
            Compradores y anfitriones gourmet
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#756353]">
              Ingresos Facturados
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#9C4124]/10 text-[#9C4124] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#261C14] tabular-nums">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Facturación neta (IVA 19% incluido)
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#756353]">
              Promedio por Reserva
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#D49A3D]/10 text-[#D49A3D] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#261C14] tabular-nums">
              {formatCurrency(averageTicket)}
            </span>
            <span className="text-xs font-semibold text-[#756353]">/ evento</span>
          </div>
          <div className="mt-2 text-[11px] text-[#756353]">
            {bookings.length} reservas registradas
          </div>
        </div>
      </div>

      {/* 2. Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8DEC8] shadow-xs">
          <div className="mb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#261C14]">
              Experiencias y Platos más Contratados por Ocasión
            </h3>
            <p className="text-xs text-[#756353]">
              Volumen de comensales y kits solicitados según el motivo del evento.
            </p>
          </div>
          <div className="h-72">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        const val = ctx.parsed.y ?? 0;
                        return `${val} comensales / unidades contratadas`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0, font: { family: 'Plus Jakarta Sans', size: 11 } },
                    grid: { color: 'rgba(232, 222, 200, 0.4)' },
                  },
                  x: {
                    ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8DEC8] shadow-xs">
          <div className="mb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#261C14]">
              Distribución por Ocasión
            </h3>
            <p className="text-xs text-[#756353]">
              Participación porcentual en facturación (COP).
            </p>
          </div>
          <div className="h-72 flex items-center justify-center">
            <Doughnut
              data={donutChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 10 } },
                  },
                },
                cutout: '65%',
              }}
            />
          </div>
        </div>

        {/* Line Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#E8DEC8] shadow-xs">
          <div className="mb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#261C14]">
              Tendencia de Ventas y Reservas en el Tiempo
            </h3>
            <p className="text-xs text-[#756353]">
              Evolución acumulada de contrataciones de chefs a domicilio y kits.
            </p>
          </div>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        const val = ctx.parsed.y ?? 0;
                        return `Facturación: ${formatCurrency(val)}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$ ${(Number(value) / 1000).toLocaleString('es-CO')}k`,
                      font: { family: 'Plus Jakarta Sans', size: 11 },
                    },
                    grid: { color: 'rgba(232, 222, 200, 0.4)' },
                  },
                  x: {
                    ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Detailed Booking & Sales Table */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DEC8]">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#261C14]">
              Historial Detallado de Ventas y Reservas
            </h3>
            <p className="text-xs text-[#756353] mt-1">
              Registro completo de anfitriones, fechas de evento y total facturado.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#756353]" />
              <input
                type="text"
                placeholder="Buscar por cliente o plato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
              />
            </div>

            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            >
              <option value="all">Todas las Ocasiones</option>
              <option value="Cena Romántica / Aniversario">Cena Romántica</option>
              <option value="Reunión Familiar & Eventos">Reunión Familiar</option>
              <option value="Asado / BBQ Gourmet">Asado / BBQ Gourmet</option>
              <option value="Menú Degustación de Autor">Degustación de Autor</option>
              <option value="Ocasión Social & Amigos">Social & Amigos</option>
              <option value="Kits de Especias (150g)">Kits de Especias (150g)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-[#E8DEC8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#C25E3E]"
            >
              <option value="all">Todos los Estados</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DEC8] text-[#756353] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">ID Reserva</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Fecha del Evento</th>
                <th className="py-3 px-3">Experiencia / Plato Contratado</th>
                <th className="py-3 px-3">Ocasión</th>
                <th className="py-3 px-3 text-center">Personas / U.</th>
                <th className="py-3 px-3 text-right">Total Facturado</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEC8]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-[#261C14]">
                    {b.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[#261C14] block">{b.customerName}</span>
                    <span className="text-[11px] text-[#756353]">{b.customerEmail}</span>
                  </td>
                  <td className="py-3 px-3 text-[#756353] whitespace-nowrap">
                    {b.eventDate}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate font-medium text-[#261C14]">
                    {b.experienceTitle}
                  </td>
                  <td className="py-3 px-3 text-[#4F5E3D] font-medium">
                    {b.occasion}
                  </td>
                  <td className="py-3 px-3 text-center font-bold tabular-nums">
                    {b.guestsOrUnits}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sm text-[#261C14] tabular-nums whitespace-nowrap">
                    {formatCurrency(b.total)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === 'Confirmado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'Pendiente'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenReceipt(b)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#9C4124] hover:bg-[#C25E3E]/10 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Comprobante</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-10 text-xs text-[#756353]">
            No se encontraron reservas con los filtros aplicados.
          </div>
        )}
      </section>
    </div>
  );
};
