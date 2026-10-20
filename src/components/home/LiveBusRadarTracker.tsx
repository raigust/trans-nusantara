import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Gauge, ShieldCheck, Navigation, Clock, CheckCircle2 } from 'lucide-react';
import { INITIAL_BUSES } from '../../data/mockData';
import { sounds } from '../../utils/soundEffects';

interface LiveBusRadarTrackerProps {
  onOpenBookingForSchedule?: (busId: string) => void;
}

export const LiveBusRadarTracker: React.FC<LiveBusRadarTrackerProps> = ({
  onOpenBookingForSchedule,
}) => {
  const [activeBusId, setActiveBusId] = useState(INITIAL_BUSES[0]?.id || 'b1');
  const [telemetryTime, setTelemetryTime] = useState(new Date().toLocaleTimeString('id-ID'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentBus = INITIAL_BUSES.find((b) => b.id === activeBusId) || INITIAL_BUSES[0];

  const waypoints = [
    { name: 'Terminal Pulo Gebang, Jakarta', passed: true, time: '07:00' },
    { name: 'Gerbang Tol Cikampek Utama Km 70', passed: true, time: '08:15' },
    { name: 'Rest Area Km 102 Cipali (Makan)', passed: true, time: '09:30' },
    { name: 'Tol Pejagan - Pemalang Km 310', passed: false, current: true, time: '11:45 (Posisi Saat Ini)' },
    { name: 'Gerbang Tol Kalikangkung, Semarang', passed: false, time: '13:00' },
    { name: 'Terminal Tirtonadi, Solo', passed: false, time: '14:30 (Estimasi Tiba)' },
  ];

  return (
    <section id="radar" className="w-full bg-[#000000] text-[#ffffff] py-20 px-4 sm:px-6 text-center border-t border-[#1a1a1a]">
      <div className="max-w-[1024px] mx-auto space-y-3">
        <p className="text-xs sm:text-sm font-semibold text-[#2997ff] uppercase tracking-wider">
          Telemetri Satelit Real-Time
        </p>
        
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-white tracking-[-0.025em] leading-[1.1]">
          Radar GPS. Kepastian posisi di setiap titik jalan tol.
        </h2>

        <p className="text-base sm:text-lg text-[#a1a1a6] font-normal max-w-2xl mx-auto pt-1 leading-relaxed">
          Pantau kecepatan jelajah, titik rest area, dan perkiraan waktu tiba dengan akurasi satelit tanpa tebak-tebakkan.
        </p>

        {/* Bus Selector Chips (Clean OLED Black Pills) */}
        <div className="flex gap-2 justify-center flex-wrap pt-5 pb-2">
          {INITIAL_BUSES.map((b) => (
            <button
              key={b.id}
              onClick={() => { sounds.playClick(); setActiveBusId(b.id); }}
              className={`px-4 py-2 rounded-full text-xs transition-all ${
                activeBusId === b.id
                  ? 'bg-white text-black font-semibold shadow-lg scale-105'
                  : 'bg-[#09090b] text-[#cccccc] border border-[#222222] hover:text-white hover:border-[#383838]'
              }`}
            >
              <span>{b.code}</span> &bull; <span>{b.plateNumber}</span> ({b.busClass})
            </button>
          ))}
        </div>

        {/* Telemetry Display Box in Pitch Black (#000000 with #0b0b0e surface) */}
        <div className="max-w-4xl mx-auto mt-8 bg-[#08080a] rounded-[22px] border border-[#1f1f23] p-6 sm:p-8 text-left space-y-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1f1f23] gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">{currentBus.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#141418] border border-[#222226] text-[#2997ff] font-medium">
                  {currentBus.plateNumber}
                </span>
              </div>
              <p className="text-xs text-[#a1a1a6] mt-1">
                Kapten Pengemudi: Sutrisno &bull; Jalur Tol Trans Jawa Non-Stop
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#86868b]">Pembaruan: {telemetryTime} WIB</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008a05]/20 text-[#34c759] border border-[#34c759]/30">
                <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
                <span>GPS Sinkron</span>
              </span>
            </div>
          </div>

          {/* 4 Telemetry Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#0e0e12] border border-[#1f1f23]">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider block">Kecepatan Rata-Rata</span>
              <div className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                {currentBus.speedKmH || 88} <span className="text-xs font-normal text-[#86868b]">km/h</span>
              </div>
              <span className="text-[11px] text-[#34c759] mt-0.5 block font-medium">Sesuai Regulasi Tol</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0e0e12] border border-[#1f1f23]">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider block">Posisi Ruas Jalan</span>
              <div className="text-sm font-semibold text-white mt-1 truncate">
                {currentBus.currentLocation || 'Tol Pejagan - Pemalang'}
              </div>
              <span className="text-[11px] text-[#86868b] mt-0.5 block">Km 310 Jalur A</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0e0e12] border border-[#1f1f23]">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider block">Rest Area Makan</span>
              <div className="text-sm font-semibold text-white mt-1 truncate">
                {currentBus.nextRestArea || 'Rest Area Km 379A Batang'}
              </div>
              <span className="text-[11px] text-[#2997ff] mt-0.5 block font-medium">Est. 45 Menit Lagi</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0e0e12] border border-[#1f1f23]">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider block">Suhu Kabin Penumpang</span>
              <div className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                21.0&deg;C
              </div>
              <span className="text-[11px] text-[#86868b] mt-0.5 block">AC HEPA Filter Sejuk</span>
            </div>
          </div>

          {/* Waypoint Track */}
          <div className="pt-2">
            <span className="text-xs uppercase tracking-wider text-[#86868b] block mb-4">
              Jejak Rute Tol Trans Jawa
            </span>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {waypoints.map((wp, idx) => (
                <div key={idx} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-1.5 p-3 rounded-xl bg-[#0e0e12] border border-[#1a1a1e]">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                    wp.current 
                      ? 'bg-[#2997ff] text-white ring-2 ring-[#2997ff]/40 shadow-sm' 
                      : wp.passed 
                      ? 'bg-[#34c759] text-white' 
                      : 'bg-[#1a1a1f] text-[#86868b]'
                  }`}>
                    {wp.passed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${wp.current ? 'text-[#2997ff]' : 'text-white'}`}>
                      {wp.name}
                    </p>
                    <p className="text-[11px] text-[#86868b] mt-0.5">{wp.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
