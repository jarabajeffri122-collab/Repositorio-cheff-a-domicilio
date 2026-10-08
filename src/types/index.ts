export type UserRole = 'admin' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export type OccasionCategory =
  | 'Cena Romántica / Aniversario'
  | 'Reunión Familiar & Eventos'
  | 'Asado / BBQ Gourmet'
  | 'Menú Degustación de Autor'
  | 'Ocasión Social & Amigos'
  | 'Kits de Especias (150g)';

export interface ChefExperience {
  id: string;
  title: string;
  chefName: string;
  occasion: OccasionCategory;
  category: 'chef_service' | 'spice_kit';
  description: string;
  menuHighlights: string[];
  price: number;
  pricingLabel: 'por persona' | 'por evento' | 'por kit 150g';
  availabilitySlots: number; // cupos o unidades disponibles
  imageUrl: string;
  minGuests?: number;
  estimatedDuration?: string;
}

export interface CartBookingItem {
  experience: ChefExperience;
  guestsOrUnits: number;
  bookingDate?: string;
  bookingTime?: string;
  specialRequests?: string;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  experienceTitle: string;
  occasion: OccasionCategory;
  guestsOrUnits: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'Confirmado' | 'Pendiente' | 'Completado';
  isSpiceKit: boolean;
  notes?: string;
}
