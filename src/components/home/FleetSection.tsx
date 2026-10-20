import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Bed, Bus, Wifi, Zap, Shield, Sparkles } from 'lucide-react';
import { FLEET_CATEGORIES } from '../../data/mockData';
import { BusClass } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface FleetSectionProps {
  onSelectClassForBooking: (busClass: BusClass) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({
  onSelectClassForBooking,
}) => {
  return (
    <section id="armada" className="w-full bg-[#000000] text-white">
      
      {/* 1. SLEEPER SUITE PITCH BLACK TILE ("Item Bles" #000000) */}
      <div id="sleeper" className="w-full bg-[#000000] text-[#ffffff] py-20 px-4 sm:px-6 text-center border-t border-[#1a1a1a]">
        <div className="max-w-[1024px] mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-[#2997ff] uppercase tracking-wider">
            First Class Sleeper Pod
          </p>
          
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1]">
            180&deg; Flatbed. Tidur senyap seperti di kamar sendiri.
          </h2>

          <p className="text-base sm:text-xl text-[#a1a1a6] font-normal max-w-2xl mx-auto pt-1 leading-relaxed">
            Kabin pribadi dengan partisi magnetik, kasur orthopedic premium, dan smart TV Android 14 inci.
          </p>

          <div className="flex items-center justify-center gap-6 pt-3">
            <button
              onClick={() => {
                sounds.playSeatSelect();
                onSelectClassForBooking('First Class Sleeper');
              }}
              className="apple-btn-primary !px-6 !py-3"
            >
              <span>Pesan Sleeper</span>
            </button>
            <button
              onClick={() => {
                sounds.playSeatSelect();
                onSelectClassForBooking('Royal Sleeper');
              }}
              className="apple-link-on-dark text-[15px]"
            >
              <span>Lihat Royal Sleeper</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Photographic Presentation with Apple Product Shadow on Pitch Black */}
          <div className="max-w-4xl mx-auto mt-10">
            <div className="rounded-[22px] overflow-hidden border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#050505] relative group">
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2400&q=90"
                alt="Sleeper Cabin Pod 180 Flatbed 4K"
                className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6 sm:p-8 text-left">
                <div className="space-y-1 max-w-xl">
                  <span className="text-[11px] font-semibold text-[#2997ff] uppercase tracking-wider">
                    Kabin Ergonomis 4K
                  </span>
                  <h4 className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
                    Zero Gravity Recline System
                  </h4>
                  <p className="text-[#a1a1a6] text-xs sm:text-sm leading-relaxed">
                    Rebahan 180° penuh tanpa mengganggu penumpang di belakang &bull; Selimut & bantal cuci steril per trip
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. APPLE WHITE CATALOG TILE (Clean White Canvas & Store Utility Cards) */}
      <div className="w-full bg-[#ffffff] py-20 px-4 sm:px-6 text-[#1d1d1f] border-t border-[#e0e0e0]">
        <div className="max-w-[1024px] mx-auto">
          
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs font-semibold text-[#0066cc] uppercase tracking-wider">
              Katalog Lengkap Armada
            </p>
            <h3 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Pilih kelas perjalanan Anda.
            </h3>
            <p className="text-sm text-[#7a7a7a] max-w-lg mx-auto">
              Semua armada berstandar sasis Scania/Mercedes-Benz Euro 5 dengan jaminan ketepatan waktu via Tol Trans Jawa.
            </p>
          </div>

          {/* Apple Store Utility Card Grid (18px radius, white cards with hairline border) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLEET_CATEGORIES.map((fleet) => (
              <div
                key={fleet.name}
                className="apple-utility-card flex flex-col justify-between text-left"
              >
                <div>
                  {/* Photo with inner 10px radius */}
                  <div className="rounded-[10px] overflow-hidden bg-[#fafafc] mb-5 aspect-[4/3] border border-[#f0f0f0]">
                    <img
                      src={fleet.imageUrl}
                      alt={fleet.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Specs */}
                  <h4 className="text-[18px] font-semibold text-[#1d1d1f] leading-snug">
                    {fleet.name}
                  </h4>
                  <p className="text-[13px] text-[#7a7a7a] mt-1 line-clamp-2 leading-relaxed">
                    {fleet.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#f0f0f0] space-y-1.5">
                    {fleet.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="text-[12px] text-[#333333] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#7a7a7a] block">Tarif Mulai</span>
                    <span className="text-[17px] font-semibold text-[#1d1d1f]">
                      Rp {fleet.priceStart.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playSeatSelect();
                      onSelectClassForBooking(fleet.name);
                    }}
                    className="apple-btn-primary !text-[13px] !py-1.5 !px-4"
                  >
                    <span>Pilih Kursi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
};
