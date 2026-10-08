import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthCRMTab } from './components/AuthCRMTab';
import { CatalogTab } from './components/CatalogTab';
import { DashboardTab } from './components/DashboardTab';
import { CartDrawer } from './components/CartDrawer';
import { ProductEditModal } from './components/ProductEditModal';
import { ChangePhotoModal } from './components/ChangePhotoModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PrintReportModal } from './components/PrintReportModal';
import { AdminGateView } from './components/AdminGateView';
import { INITIAL_EXPERIENCES, INITIAL_BOOKINGS, DEMO_USERS } from './data/initialData';
import { User, UserRole, ChefExperience, CartBookingItem, BookingRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'crm' | 'catalog' | 'dashboard'>('catalog');

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('chef_user_v4');
    return saved ? JSON.parse(saved) : DEMO_USERS.admin;
  });

  const [experiences, setExperiences] = useState<ChefExperience[]>(() => {
    const saved = localStorage.getItem('chef_experiences_10exp_v1');
    return saved ? JSON.parse(saved) : INITIAL_EXPERIENCES;
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('chef_bookings_10exp_v1');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [cartItems, setCartItems] = useState<CartBookingItem[]>(() => {
    const saved = localStorage.getItem('chef_cart_10exp_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editExperienceModal, setEditExperienceModal] = useState<ChefExperience | null>(null);
  const [photoExperienceModal, setPhotoExperienceModal] = useState<ChefExperience | null>(null);
  const [receiptModal, setReceiptModal] = useState<BookingRecord | null>(null);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // LocalStorage syncing
  useEffect(() => {
    localStorage.setItem('chef_experiences_10exp_v1', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('chef_bookings_10exp_v1', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('chef_cart_10exp_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('chef_user_v4', JSON.stringify(currentUser));
  }, [currentUser]);

  const handleSwitchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
    } else {
      setCurrentUser(DEMO_USERS.cliente);
    }
  };

  // Cart operations
  const handleAddToCart = (experience: ChefExperience) => {
    if (experience.availabilitySlots <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((it) => it.experience.id === experience.id);
      if (existing) {
        const nextQty = Math.min(experience.availabilitySlots, existing.guestsOrUnits + 1);
        return prev.map((it) =>
          it.experience.id === experience.id ? { ...it, guestsOrUnits: nextQty } : it
        );
      }
      return [
        ...prev,
        {
          experience,
          guestsOrUnits: experience.minGuests || 1,
          bookingDate: '2026-10-18',
          bookingTime: '20:00',
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (experienceId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(experienceId);
      return;
    }

    setCartItems((prev) =>
      prev.map((it) => {
        if (it.experience.id === experienceId) {
          const exp = experiences.find((e) => e.id === experienceId) || it.experience;
          const capped = Math.min(exp.availabilitySlots, quantity);
          return { ...it, guestsOrUnits: capped };
        }
        return it;
      })
    );
  };

  const handleUpdateCartDetails = (
    experienceId: string,
    date: string,
    time: string,
    notes: string
  ) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.experience.id === experienceId
          ? { ...it, bookingDate: date, bookingTime: time, specialRequests: notes }
          : it
      )
    );
  };

  const handleRemoveCartItem = (experienceId: string) => {
    setCartItems((prev) => prev.filter((it) => it.experience.id !== experienceId));
  };

  // CRUD for Experiences
  const handleAddExperience = (newExpData: Omit<ChefExperience, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newExp: ChefExperience = {
      ...newExpData,
      id,
    };
    setExperiences((prev) => [newExp, ...prev]);
  };

  const handleUpdateExperience = (updated: ChefExperience) => {
    setExperiences((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setCartItems((prev) =>
      prev.map((it) =>
        it.experience.id === updated.id ? { ...it, experience: updated } : it
      )
    );
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    setCartItems((prev) => prev.filter((it) => it.experience.id !== id));
  };

  const handleSavePhoto = (id: string, newUrl: string) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, imageUrl: newUrl } : e))
    );
    setCartItems((prev) =>
      prev.map((it) =>
        it.experience.id === id
          ? { ...it, experience: { ...it.experience, imageUrl: newUrl } }
          : it
      )
    );
  };

  // Checkout / Booking confirmation
  const handleCheckout = ({
    name,
    email,
    eventDate,
    notes,
  }: {
    name: string;
    email: string;
    eventDate: string;
    notes: string;
  }) => {
    if (cartItems.length === 0) return;

    const newBookings: BookingRecord[] = [];

    cartItems.forEach((it) => {
      const lineSubtotal = it.experience.price * it.guestsOrUnits;
      const lineTax = lineSubtotal * 0.19;
      const lineTotal = lineSubtotal + lineTax;
      const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

      newBookings.push({
        id: resId,
        customerName: name,
        customerEmail: email,
        eventDate: it.bookingDate || eventDate,
        experienceTitle: it.experience.title,
        occasion: it.experience.occasion,
        guestsOrUnits: it.guestsOrUnits,
        subtotal: lineSubtotal,
        tax: lineTax,
        total: lineTotal,
        status: 'Confirmado',
        isSpiceKit: it.experience.category === 'spice_kit',
        notes: it.specialRequests || notes,
      });
    });

    // 1. Decrement availability in experiences
    setExperiences((prev) =>
      prev.map((exp) => {
        const found = cartItems.find((it) => it.experience.id === exp.id);
        if (found) {
          const nextSlots = Math.max(0, exp.availabilitySlots - found.guestsOrUnits);
          return { ...exp, availabilitySlots: nextSlots };
        }
        return exp;
      })
    );

    // 2. Append to bookings
    setBookings((prev) => [...newBookings, ...prev]);

    // 3. Clear cart
    setCartItems([]);
    setIsCartOpen(false);

    // 4. Open receipt for the first new booking
    if (newBookings.length > 0) {
      setReceiptModal(newBookings[0]);
    }
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.guestsOrUnits, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'crm' && (
          <AuthCRMTab
            currentUser={currentUser}
            onLogin={(user) => setCurrentUser(user)}
            experiences={experiences}
            onAddExperience={handleAddExperience}
            onUpdateExperience={handleUpdateExperience}
            onDeleteExperience={handleDeleteExperience}
            onOpenEditModal={(exp) => setEditExperienceModal(exp)}
            onOpenPhotoModal={(exp) => setPhotoExperienceModal(exp)}
            onNavigateToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogTab
            experiences={experiences}
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            onOpenEditModal={(exp) => setEditExperienceModal(exp)}
            onOpenPhotoModal={(exp) => setPhotoExperienceModal(exp)}
            onDeleteExperience={handleDeleteExperience}
          />
        )}

        {activeTab === 'dashboard' && (
          currentUser.role === 'admin' ? (
            <DashboardTab
              experiences={experiences}
              bookings={bookings}
              onOpenReceipt={(b) => setReceiptModal(b)}
              onOpenPrintReport={() => setIsPrintReportOpen(true)}
            />
          ) : (
            <AdminGateView
              onUnlockAsAdmin={(adminUser) => setCurrentUser(adminUser)}
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8DEC8] bg-white/70 text-xs text-[#756353] py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-sm text-[#261C14]">
              Chef en Casa
            </span>
            <span aria-hidden="true">·</span>
            <span>Experiencias Gastronómicas Privadas & Kits de Autor (150g)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Cocineros Certificados</span>
            <span aria-hidden="true">·</span>
            <span>Protocolo de Bioseguridad y Limpieza Integral</span>
          </div>
        </div>
      </footer>

      {/* Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateDetails={handleUpdateCartDetails}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Modals */}
      <ProductEditModal
        experience={editExperienceModal}
        isOpen={!!editExperienceModal}
        onClose={() => setEditExperienceModal(null)}
        onSave={handleUpdateExperience}
      />

      <ChangePhotoModal
        experience={photoExperienceModal}
        isOpen={!!photoExperienceModal}
        onClose={() => setPhotoExperienceModal(null)}
        onSavePhoto={handleSavePhoto}
      />

      <ReceiptModal
        booking={receiptModal}
        isOpen={!!receiptModal}
        onClose={() => setReceiptModal(null)}
      />

      <PrintReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        experiences={experiences}
        bookings={bookings}
      />
    </div>
  );
}
