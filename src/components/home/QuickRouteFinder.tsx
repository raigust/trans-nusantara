import React, { useState } from 'react';
import { 
  Search, Calendar, MapPin, Bus, AlertCircle, Info, Smile, 
  Clock, Map, Ticket, ArrowRight, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { Schedule } from '../../types';

interface QuickRouteFinderProps {
  onSearch: (origin: string, destination: string, date: string, busClass: string) => void;
  onOpenBookingModal: (preselected?: Schedule) => void;
}

export const QuickRouteFinder: React.FC<QuickRouteFinderProps> = ({
  onSearch,
  onOpenBookingModal,
}) => {
  const [origin, setOrigin] = useState('Jakarta');
  const [destination, setDestination] = useState('Yogyakarta');
  const [date, setDate] = useState('2026-10-18');
  const [busClass, setBusClass] = useState('Semua');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(origin, destination, date, busClass);
    onOpenBookingModal();
  };

  const infoPills = [
    { code: 'L001', label: 'Informasi Umum & Syarat', icon: Info },
    { code: 'L002', label: 'Prosedur Boarding & Bagasi', icon: AlertCircle },
    { code: 'L003', label: 'Garansi Ketepatan Waktu 99.4%', icon: Smile },
    { code: 'L004', label: 'Live GPS Armada Terhubung', icon: Bus },
  ];

  const quickFeatures = [
    {
      title: 'Agen & Pool Resmi',
      desc: '120+ titik keberangkatan terintegrasi',
      icon: MapPin,
      badge: 'Lokasi Terdekat',
    },
    {
      title: 'Tiket & Harga Resmi',
      desc: 'Transparan tanpa biaya tersembunyi',
      icon: Ticket,
      badge: 'Harga Terbaik',
    },
    {
      title: 'Pilihan Armada Bus',
      desc: 'Sleeper Suites, Exec Plus, Super Exec',
      icon: Bus,
      badge: 'Chassis Eropa',
    },
    {
      title: 'Jadwal Lengkap',
      desc: 'Pagi, siang, dan malam tiap hari',
      icon: Clock,
      badge: 'Fasilitas Resto',
    },
    {
      title: 'Pantau Info Perjalanan',
      desc: 'Status jalan tol, cuaca, & rest area',
      icon: Map,
      badge: 'Live Update',
    },
  ];

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 container mx-auto px-4 mb-16">
      {/* Route Finder Card - Golden/Amber Accent matching Image 2 */}
      <div className="bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Yellow Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 px-6 py-3.5 text-slate-950 flex flex-wrap items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-slate-950" />
            <span className="font-heading text-base uppercase tracking-wider font-extrabold">
              Cari Rute & Pesan Tiket Bus
            </span>
          </div>
          <span className="text-xs font-semibold bg-slate-950/10 px-3 py-1 rounded-full">
            Tersedia Pemesanan H-30 Hari
          </span>
        </div>

        {/* Search Form Inputs */}
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Kota Keberangkatan</span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="Jakarta">Jakarta (Pulo Gebang / Pondok Pinang)</option>
                <option value="Surabaya">Surabaya (Bungurasih)</option>
                <option value="Bandung">Bandung (Pasteur / Leuwipanjang)</option>
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Kota Tujuan</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="Yogyakarta">Yogyakarta (Giwangan / Jombor)</option>
                <option value="Surabaya">Surabaya (Bungurasih)</option>
                <option value="Solo">Solo (Tirtonadi)</option>
                <option value="Bandung">Bandung (Pasteur)</option>
                <option value="Denpasar (Bali)">Denpasar, Bali (Mengwi)</option>
                <option value="Malang">Malang (Arjosari)</option>
                <option value="Semarang">Semarang (Krapyak)</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Tanggal Berangkat</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Class & Submit */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="submit"
                className="w-full h-[46px] rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Cari Jadwal Bus</span>
              </button>
            </div>
          </div>
        </form>

        {/* 4 Info Pills Direct Reference to Image 2 (L001 - L004) */}
        <div className="border-t border-slate-800 bg-slate-950/60 px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {infoPills.map((pill) => (
              <div 
                key={pill.code} 
                className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors py-1 cursor-pointer"
              >
                <pill.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-amber-400 mr-1.5">{pill.code}</span>
                  <span className="text-[11px] text-slate-400">{pill.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Quick Feature Cards (Direct Reference to Image 2 Icon Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {quickFeatures.map((feat, idx) => (
          <div
            key={idx}
            onClick={() => onOpenBookingModal()}
            className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <feat.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                {feat.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {feat.desc}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-600">
              <span>{feat.badge}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
