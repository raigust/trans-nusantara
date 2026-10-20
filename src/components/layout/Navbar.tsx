import React, { useState } from 'react';
import { Bus, Search, Ticket, Shield, Menu, X, Volume2, VolumeX, ChevronRight, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenCheckTicket: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  isAdminRoute?: boolean;
  onNavigateAdmin?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenCheckTicket,
  activeSection,
  onNavigateSection,
  isAdminRoute = false,
  onNavigateAdmin,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(sounds.enabled);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundActive(sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const navLinks = [
    { id: 'beranda', label: 'Overview' },
    { id: 'sleeper', label: 'First Class Sleeper' },
    { id: 'armada', label: 'Double Decker' },
    { id: 'jadwal', label: 'Rute & Tarif' },
    { id: 'radar', label: 'Radar GPS' },
    { id: 'inovasi', label: 'Inovasi' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* 1. Global Nav (Apple Signature: 44px Pure Black #000000, 12px SF Pro Text) */}
      <div className="bg-[#000000] text-[#ffffff] h-[44px] flex items-center px-4 sm:px-8 border-b border-[#333333]/40">
        <div className="max-w-[1024px] mx-auto w-full flex items-center justify-between text-[12px] font-normal tracking-[-0.12px]">
          
          {/* Logo Glyph */}
          <button
            onClick={() => {
              sounds.playClick();
              if (onNavigateHome) onNavigateHome();
              else onNavigateSection('beranda');
            }}
            className="flex items-center gap-2 text-white hover:opacity-75 transition-opacity focus:outline-none"
            title="TransNusantara Express"
          >
            <Bus className="w-4 h-4 stroke-[2]" />
            <span className="font-semibold text-xs tracking-tight">TransNusantara</span>
          </button>

          {/* Desktop Global Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-[#d2d2d7]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  sounds.playClick();
                  if (isAdminRoute && onNavigateHome) {
                    onNavigateHome();
                    setTimeout(() => onNavigateSection(link.id), 100);
                  } else {
                    onNavigateSection(link.id);
                  }
                }}
                className={`hover:text-white transition-colors text-[12px] ${
                  activeSection === link.id && !isAdminRoute ? 'text-white font-medium' : ''
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Separate Admin Endpoint Link */}
            <button
              onClick={() => {
                sounds.playClick();
                if (onNavigateAdmin) onNavigateAdmin();
              }}
              className={`hover:text-[#2997ff] flex items-center gap-1 transition-colors text-[12px] ${
                isAdminRoute ? 'text-[#2997ff] font-semibold' : 'text-[#a1a1a6]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portal Admin (/admin)</span>
            </button>
          </nav>

          {/* Right Utilities (Sound & Ticket Check) */}
          <div className="flex items-center gap-4 text-[#d2d2d7]">
            <button
              onClick={toggleSound}
              title={soundActive ? 'Suara Aktif' : 'Suara Mati'}
              className="hover:text-white transition-colors"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#2997ff]" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenCheckTicket(); }}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
              title="Cari Tiket"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[12px]">Cek Tiket</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Sub-Nav Frosted (Apple Signature Light Frosted Glass) */}
      <div className="h-[52px] bg-white/80 backdrop-blur-xl border-b border-[#e0e0e0] flex items-center px-4 sm:px-8 text-[#1d1d1f]">
        <div className="max-w-[1024px] mx-auto w-full flex items-center justify-between">
          
          {/* Left: Product Line Tagline in 21px / 600 SF Pro Display */}
          <div className="flex items-center gap-3">
            <span className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
              {isAdminRoute ? 'TransNusantara Admin Ops' : 'TransNusantara Express'}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#7a7a7a] font-normal border border-[#d2d2d7] px-2 py-0.5 rounded-full">
              {isAdminRoute ? 'Endpoint: /admin' : 'Euro 5 Air Suspension'}
            </span>
          </div>

          {/* Right Actions: Overview links & Action Blue #0066cc Pill */}
          <div className="flex items-center gap-3">
            {isAdminRoute ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onNavigateHome) onNavigateHome();
                }}
                className="text-[14px] text-[#0066cc] hover:underline flex items-center gap-1"
              >
                <span>&larr; Kembali ke Beranda</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { sounds.playClick(); onOpenCheckTicket(); }}
                  className="hidden sm:inline-block text-[14px] text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                >
                  Status Tiket
                </button>
                <button
                  onClick={() => { sounds.playClick(); onOpenBooking(); }}
                  className="apple-btn-primary !text-[13px] !py-1.5 !px-4"
                >
                  <span>Pesan Tiket</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#000000] text-white px-6 py-5 space-y-4 border-b border-[#333333] animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                if (isAdminRoute && onNavigateHome) {
                  onNavigateHome();
                  setTimeout(() => onNavigateSection(link.id), 100);
                } else {
                  onNavigateSection(link.id);
                }
              }}
              className="block w-full text-left text-sm py-1.5 text-[#d2d2d7] hover:text-white"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#333333] space-y-3">
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                if (isAdminRoute && onNavigateHome) onNavigateHome();
                else if (onNavigateAdmin) onNavigateAdmin();
              }}
              className="block w-full text-left text-sm text-[#2997ff] font-medium"
            >
              {isAdminRoute ? '← Kembali ke Beranda' : '🛡️ Buka Portal Admin (/admin)'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="apple-btn-primary w-full text-center"
            >
              Pesan Tiket Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
