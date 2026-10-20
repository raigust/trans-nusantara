import React, { useState } from 'react';
import { 
  ChevronRight, ArrowRight, Search, Calendar, MapPin, 
  Shield, Star, Sparkles, Eye, Camera, CheckCircle2 
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface HeroBannerProps {
  onOpenBooking: () => void;
  onOpenBookingWithFilter?: (origin: string, destination: string, busClass?: string) => void;
  onExploreFleet?: () => void;
}

const HERO_4K_IMAGES = [
  {
    id: 'exterior-dream',
    title: 'Scania K410IB Jetbus 5 SDD (4K Eksterior)',
    desc: 'Double Decker Voyager 6x2 Opticruise',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=3840&q=95',
    badge: '4K Ultra HD &bull; Flagship Exterior'
  },
  {
    id: 'sleeper-cockpit',
    title: 'First Class Sleeper Suite 180° Flatbed',
    desc: 'Kabin Senyap Zero-Gravity dengan Layar AVOD 14"',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=3840&q=95',
    badge: '4K Ultra HD &bull; Interior Luxury'
  },
  {
    id: 'night-express',
    title: 'Tol Trans Jawa Malam Hari Non-Stop',
    desc: 'Kecepatan Stabil dengan Retarder Scania & EBS',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=3840&q=95',
    badge: '4K Ultra HD &bull; Night Express'
  }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenBooking,
  onOpenBookingWithFilter,
  onExploreFleet,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [origin, setOrigin] = useState('Jakarta (Pulo Gebang)');
  const [destination, setDestination] = useState('Solo (Tirtonadi)');
  const [date, setDate] = useState('2026-10-25');

  const currentPhoto = HERO_4K_IMAGES[selectedPhotoIndex];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (onOpenBookingWithFilter) {
      onOpenBookingWithFilter(origin, destination);
    } else {
      onOpenBooking();
    }
  };

  return (
    <section 
      id="beranda" 
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between text-white overflow-hidden bg-black"
    >
      {/* 4K FULL BACKGROUND IMAGE (Edge-to-Edge) */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-1000 ease-out animate-in fade-in duration-700"
        />

        {/* Cinematic Multi-stop Dark Vignette Overlay:
            - Dark top for crystal-clear navbar & logo contrast
            - Clearer middle to let the gorgeous 4K bus shine
            - True pitch black ('item bles' #000000) at bottom for seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#000000] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* Top Floating Badge Bar: 4K Ultra HD indicator & Photo Switcher */}
      <div className="relative z-10 max-w-[1180px] mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#2997ff] -ml-4" />
          <span className="font-semibold tracking-wider text-[11px] uppercase text-[#2997ff]">4K Ultra HD</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-white/90 truncate max-w-[220px] sm:max-w-none">{currentPhoto.title}</span>
        </div>

        {/* 4K Photo Angle Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
          {HERO_4K_IMAGES.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => {
                sounds.playClick();
                setSelectedPhotoIndex(idx);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                selectedPhotoIndex === idx
                  ? 'bg-white text-black shadow-md font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Angle {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cinematic Centerpiece Content */}
      <div className="relative z-10 max-w-[1024px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-5 my-auto">
        <p className="text-xs sm:text-sm font-semibold text-[#2997ff] uppercase tracking-widest drop-shadow-md">
          TransNusantara Double Decker &middot; Generasi Terbaru
        </p>

        {/* 56px / 600 SF Pro Display with Apple Tight letter-spacing on 4K Background */}
        <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-semibold text-white tracking-[-0.03em] leading-[1.05] max-w-4xl mx-auto drop-shadow-2xl">
          Kenyamanan kelas satu. Di setiap kilometer.
        </h1>

        {/* Subtitle with High Legibility */}
        <p className="text-lg sm:text-2xl text-white/90 font-normal tracking-[-0.01em] max-w-2xl mx-auto pt-1 drop-shadow-lg leading-relaxed">
          Chassis Scania K410IB berkecepatan mulus. Kabin hening dengan sleeper suite 180° flatbed.
        </p>

        {/* Apple Dual Pill Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => { sounds.playClick(); onOpenBooking(); }}
            className="apple-btn-primary !px-7 !py-3.5 !text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Pesan Tiket Sekarang</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => { sounds.playClick(); if (onExploreFleet) onExploreFleet(); }}
            className="px-6 py-3 rounded-full text-base font-normal text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 hover:border-white transition-all flex items-center gap-2 active:scale-95 shadow-lg"
          >
            <span>Eksplorasi Armada 4K</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Integrated Fast Booking Pill Bar (Frosted Black Glass on 4K Background) */}
      <div className="relative z-10 max-w-[960px] mx-auto w-full px-4 sm:px-6 pb-10">
        <div className="p-3 sm:p-2.5 bg-black/75 backdrop-blur-xl rounded-2xl sm:rounded-full border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
          
          {/* Origin Picker */}
          <div className="flex-1 px-4 py-1.5 text-left w-full sm:w-auto">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a6] font-semibold block">
              Kota Asal
            </span>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer truncate [&>option]:text-black"
            >
              <option value="Jakarta (Pulo Gebang)">Jakarta (Pulo Gebang)</option>
              <option value="Bandung (Leuwi Panjang)">Bandung (Leuwi Panjang)</option>
              <option value="Semarang (Krapyak)">Semarang (Krapyak)</option>
              <option value="Solo (Tirtonadi)">Solo (Tirtonadi)</option>
              <option value="Surabaya (Purabaya)">Surabaya (Purabaya)</option>
            </select>
          </div>

          <div className="hidden sm:block w-[1px] h-9 bg-white/20" />

          {/* Destination Picker */}
          <div className="flex-1 px-4 py-1.5 text-left w-full sm:w-auto">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a6] font-semibold block">
              Kota Tujuan
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer truncate [&>option]:text-black"
            >
              <option value="Solo (Tirtonadi)">Solo (Tirtonadi)</option>
              <option value="Yogyakarta (Giwangan)">Yogyakarta (Giwangan)</option>
              <option value="Surabaya (Purabaya)">Surabaya (Purabaya)</option>
              <option value="Denpasar (Mengwi)">Denpasar (Bali)</option>
              <option value="Semarang (Krapyak)">Semarang (Krapyak)</option>
            </select>
          </div>

          <div className="hidden sm:block w-[1px] h-9 bg-white/20" />

          {/* Date Picker */}
          <div className="flex-1 px-4 py-1.5 text-left w-full sm:w-auto">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a6] font-semibold block">
              Tanggal Berangkat
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchSubmit}
            className="w-full sm:w-auto apple-btn-primary !py-3 !px-7 shadow-lg font-medium"
          >
            <span>Cari Tiket</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Subtle sub-caption under booking bar */}
        <div className="flex items-center justify-center gap-4 text-[12px] text-white/70 mt-3.5">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" /> Kursi Terkonfirmasi Instan
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" /> Termasuk Santap Prasmanan
          </span>
          <span>&bull;</span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" /> Tol Trans Jawa Non-Stop
          </span>
        </div>
      </div>
    </section>
  );
};
