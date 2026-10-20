import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FleetSection } from './components/home/FleetSection';
import { LiveBusRadarTracker } from './components/home/LiveBusRadarTracker';
import { AboutSection } from './components/home/AboutSection';
import { NewsSection } from './components/home/NewsSection';
import { MobileAppBanner } from './components/home/MobileAppBanner';
import { BookingWizardModal } from './components/booking/BookingWizardModal';
import { ETicketModal } from './components/booking/ETicketModal';
import { TicketLookupModal } from './components/booking/TicketLookupModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Schedule, Booking, BusClass } from './types';
import { StorageService } from './services/storageService';
import { sounds } from './utils/soundEffects';
import { ArrowRight, CheckCircle2, ChevronRight, Shield } from 'lucide-react';

export default function App() {
  // Check whether user requested the separate /admin endpoint
  const checkIsAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    return (
      pathname === '/admin' || 
      pathname.startsWith('/admin/') || 
      hash === '#/admin' || 
      hash.startsWith('#/admin')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminPath);
  const [activeSection, setActiveSection] = useState('beranda');

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTicketLookupOpen, setIsTicketLookupOpen] = useState(false);
  const [activeETicket, setActiveETicket] = useState<Booking | null>(null);
  const [preselectedSchedule, setPreselectedSchedule] = useState<Schedule | null>(null);

  // Success Notification Toast (Apple minimal floating pill)
  const [showBookingSuccessToast, setShowBookingSuccessToast] = useState<string | null>(null);

  // Synchronize route with browser history & URL
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    sounds.playClick();
    setIsAdminRoute(true);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/admin');
    } else {
      window.location.hash = '/admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    sounds.playClick();
    setIsAdminRoute(false);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/');
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (schedule?: Schedule) => {
    sounds.playSeatSelect();
    setPreselectedSchedule(schedule || null);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingWithFilter = (origin: string, destination: string, busClass?: string) => {
    sounds.playSeatSelect();
    const all = StorageService.getSchedules();
    const matched = all.find(s => 
      s.route.origin.toLowerCase().includes(origin.split(' ')[0].toLowerCase()) && 
      s.route.destination.toLowerCase().includes(destination.split(' ')[0].toLowerCase())
    );
    setPreselectedSchedule(matched || null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (booking: Booking) => {
    sounds.playSuccess();
    setActiveETicket(booking);
    setShowBookingSuccessToast(`Pemesanan berhasil! Kode booking: ${booking.bookingCode}`);
    setTimeout(() => setShowBookingSuccessToast(null), 6000);
  };

  const handleSelectClassForBooking = (busClass: BusClass) => {
    const schedules = StorageService.getSchedules();
    const matched = schedules.find(s => s.bus.busClass === busClass);
    handleOpenBooking(matched);
  };

  const handleNavigateSection = (sectionId: string) => {
    sounds.playClick();
    setActiveSection(sectionId);
    if (isAdminRoute) {
      navigateToHome();
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const popularSchedules = StorageService.getSchedules().slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans selection:bg-[#0066cc]/20 selection:text-[#0066cc]">
      
      {/* Toast Notification (Apple Minimal Floating Pill) */}
      {showBookingSuccessToast && (
        <div className="fixed top-28 right-4 sm:right-8 z-50 bg-[#1d1d1f] text-white px-5 py-3 rounded-full shadow-lg text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
          <span>{showBookingSuccessToast}</span>
        </div>
      )}

      {/* Persistent Two-Row Apple Navigation (44px Global Nav + 52px Sub Nav) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenCheckTicket={() => setIsTicketLookupOpen(true)}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        isAdminRoute={isAdminRoute}
        onNavigateAdmin={navigateToAdmin}
        onNavigateHome={navigateToHome}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {isAdminRoute ? (
          /* SEPARATE ENDPOINT: /admin */
          <AdminDashboard
            onOpenETicket={(booking) => setActiveETicket(booking)}
            onNavigateHome={navigateToHome}
          />
        ) : (
          /* MAIN GUEST EXPERIENCE (Edge-to-Edge 4K Overview & Alternating Light and Dark Tiles) */
          <>
            {/* Tile 1: 4K Full Background Hero Overview */}
            <HeroBanner
              onOpenBooking={() => handleOpenBooking()}
              onOpenBookingWithFilter={handleOpenBookingWithFilter}
              onExploreFleet={() => handleNavigateSection('armada')}
            />

            {/* Tile 2 & 3: Sleeper Dark Tile (#000000 - replaced murky gray) & Catalog Showcase (#ffffff White Canvas) */}
            <FleetSection onSelectClassForBooking={handleSelectClassForBooking} />

            {/* Tile 4: Popular Schedules & Routes on Clean White Canvas (#ffffff) */}
            <section id="jadwal" className="w-full bg-[#ffffff] py-20 px-4 sm:px-6 text-[#1d1d1f] border-t border-[#e0e0e0]">
              <div className="max-w-[1024px] mx-auto text-left space-y-10">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0066cc] uppercase tracking-wider block">
                      Rute Keberangkatan Tol Trans Jawa
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
                      Jadwal Populer Hari Ini
                    </h2>
                    <p className="text-sm text-[#7a7a7a] mt-0.5">
                      Pemesanan kursi langsung terkonfirmasi &bull; Termasuk prasmanan resto
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenBooking()}
                    className="apple-link text-[15px]"
                  >
                    <span>Cari Semua Rute & Tarif</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 2-Column Store Utility Grid (18px radius, white cards with hairline border #e0e0e0) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularSchedules.map((sch) => {
                    const booked = sch.bookedSeats?.length || 0;
                    const seatsLeft = sch.bus.seatCapacity - booked;

                    return (
                      <div
                        key={sch.id}
                        className="apple-utility-card flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
                            {sch.bus.busClass}
                          </span>
                          <span className="text-xs text-[#34c759] font-medium">
                            Tersisa {seatsLeft} Kursi
                          </span>
                        </div>

                        {/* Origin -> Destination Details */}
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <span className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{sch.departureTime}</span>
                            <span className="text-sm font-semibold text-[#1d1d1f] block mt-1">{sch.route.origin}</span>
                            <span className="text-xs text-[#7a7a7a] block">{sch.route.originTerminal}</span>
                          </div>

                          <div className="flex flex-col items-center px-4">
                            <span className="text-[11px] text-[#7a7a7a] font-normal">{sch.route.estimatedHours} Jam</span>
                            <div className="w-20 h-0.5 bg-[#e0e0e0] relative my-1.5">
                              <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#0066cc]" />
                            </div>
                            <span className="text-[10px] text-[#34c759] font-medium">Tol Trans Jawa</span>
                          </div>

                          <div className="text-right">
                            <span className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{sch.arrivalTime}</span>
                            <span className="text-sm font-semibold text-[#1d1d1f] block mt-1">{sch.route.destination}</span>
                            <span className="text-xs text-[#7a7a7a] block">{sch.route.destinationTerminal}</span>
                          </div>
                        </div>

                        {/* Facilities info */}
                        <div className="flex items-center gap-2 text-xs text-[#7a7a7a] pt-1">
                          <span>Prasmanan Resto</span>
                          <span>&bull;</span>
                          <span>WiFi Starlink</span>
                          <span>&bull;</span>
                          <span>AC HEPA</span>
                          <span>&bull;</span>
                          <span>USB 45W</span>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-[#7a7a7a] block">Tarif Kursi</span>
                            <span className="text-xl font-semibold text-[#1d1d1f]">
                              Rp {sch.basePrice.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <button
                            onClick={() => handleOpenBooking(sch)}
                            className="apple-btn-primary !text-xs !py-2 !px-4"
                          >
                            <span>Pilih Kursi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* Tile 5: Live Radar GPS Tracker (Pure Black #000000 - replaced murky gray) */}
            <LiveBusRadarTracker />

            {/* Tile 6: About Section - Inovasi & Keselamatan Euro 5 (Light Canvas #ffffff) */}
            <AboutSection onOpenBooking={() => handleOpenBooking()} />

            {/* Tile 7: Guest Stories & News (Parchment #f5f5f7) */}
            <NewsSection />

            {/* Tile 8: Mobile App Banner */}
            <MobileAppBanner />
          </>
        )}
      </main>

      {/* Global Apple Footer on Parchment #f5f5f7 */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenCheckTicket={() => setIsTicketLookupOpen(true)}
        onNavigateSection={handleNavigateSection}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedSchedule={preselectedSchedule}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Digital E-Ticket & Boarding Pass Modal */}
      <ETicketModal
        isOpen={!!activeETicket}
        booking={activeETicket}
        onClose={() => setActiveETicket(null)}
      />

      {/* Ticket Lookup Modal */}
      <TicketLookupModal
        isOpen={isTicketLookupOpen}
        onClose={() => setIsTicketLookupOpen(false)}
        onSelectBooking={(b) => setActiveETicket(b)}
      />

    </div>
  );
}
