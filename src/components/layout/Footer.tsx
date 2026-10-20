import React from 'react';
import { Bus, Shield, Globe } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface FooterProps {
  onOpenBooking?: () => void;
  onOpenCheckTicket?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenCheckTicket,
  onNavigateSection,
  onNavigateAdmin,
}) => {
  const handleNav = (id: string) => {
    sounds.playClick();
    if (onNavigateSection) onNavigateSection(id);
  };

  return (
    <footer className="w-full bg-[#ffffff] text-[#333333] border-t border-[#e0e0e0] py-16 px-4 sm:px-6 text-left">
      <div className="max-w-[1024px] mx-auto space-y-12">
        
        {/* Footnote Disclaimers (Apple fine-print 12px) */}
        <div className="text-[12px] text-[#7a7a7a] leading-relaxed pb-8 border-b border-[#e0e0e0] space-y-2">
          <p>
            * Waktu tempuh perjalanan Tol Trans Jawa dihitung berdasarkan kecepatan jelajah aman 80–100 km/jam sesuai regulasi Kementerian Perhubungan RI dan kondisi lalu lintas real-time.
          </p>
          <p>
            1. Fasilitas prasmanan gratis berlaku untuk satu kali santap per tiket di Rest Area resmi mitra TransNusantara di Rest Area Km 102 Subang atau Solo.
          </p>
          <p>
            2. Seluruh penumpang terproteksi asuransi perjalanan resmi Jasa Raharja sesuai dengan UU No. 33 Tahun 1964.
          </p>
        </div>

        {/* 5-Column Apple Directory Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-[12px]">
          
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3 text-[12px]">
              Eksplorasi Armada
            </h4>
            <ul className="space-y-2 text-[#4b4b4d]">
              <li><button onClick={() => handleNav('sleeper')} className="hover:text-[#0066cc]">First Class Sleeper</button></li>
              <li><button onClick={() => handleNav('armada')} className="hover:text-[#0066cc]">Double Decker Suites</button></li>
              <li><button onClick={() => handleNav('armada')} className="hover:text-[#0066cc]">Super Top 2-1</button></li>
              <li><button onClick={() => handleNav('armada')} className="hover:text-[#0066cc]">Executive Plus</button></li>
              <li><button onClick={() => handleNav('inovasi')} className="hover:text-[#0066cc]">Chassis Scania Euro 5</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3 text-[12px]">
              Rute Favorit
            </h4>
            <ul className="space-y-2 text-[#4b4b4d]">
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Jakarta &rarr; Solo</button></li>
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Jakarta &rarr; Yogyakarta</button></li>
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Jakarta &rarr; Surabaya</button></li>
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Bandung &rarr; Semarang</button></li>
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Surabaya &rarr; Denpasar</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3 text-[12px]">
              Layanan Penumpang
            </h4>
            <ul className="space-y-2 text-[#4b4b4d]">
              <li><button onClick={() => onOpenBooking?.()} className="hover:text-[#0066cc]">Reservasi Kursi Online</button></li>
              <li><button onClick={() => onOpenCheckTicket?.()} className="hover:text-[#0066cc]">Cek & Unduh E-Tiket QR</button></li>
              <li><button onClick={() => handleNav('radar')} className="hover:text-[#0066cc]">Radar Telemetri GPS</button></li>
              <li><a href="#bantuan" className="hover:text-[#0066cc]">Ketentuan Bagasi 20 Kg</a></li>
              <li><a href="#refund" className="hover:text-[#0066cc]">Jadwal Ulang & Refund</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3 text-[12px]">
              Sistem Operasional
            </h4>
            <ul className="space-y-2 text-[#4b4b4d]">
              <li>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateAdmin) onNavigateAdmin();
                  }}
                  className="text-[#0066cc] font-medium hover:underline flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Portal Admin (/admin)</span>
                </button>
              </li>
              <li><span className="text-[#7a7a7a]">Scanner Boarding Gate</span></li>
              <li><span className="text-[#7a7a7a]">Manajemen Armada Bus</span></li>
              <li><span className="text-[#7a7a7a]">Manifest Penumpang</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3 text-[12px]">
              Tentang TransNusantara
            </h4>
            <ul className="space-y-2 text-[#4b4b4d]">
              <li><span className="text-[#7a7a7a]">PT TransNusantara Express</span></li>
              <li><span className="text-[#7a7a7a]">Izin Kemenhub SK.0042/AJ</span></li>
              <li><span className="text-[#7a7a7a]">Call Center: 0800-1-TRANS</span></li>
              <li><span className="text-[#7a7a7a]">Cawang, Jakarta Timur</span></li>
            </ul>
          </div>

        </div>

        {/* Legal Row at Bottom */}
        <div className="pt-8 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#7a7a7a]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Hak Cipta &copy; 2026 PT TransNusantara Express Indonesia. Hak cipta dilindungi undang-undang.</span>
            <div className="flex items-center gap-3 text-[#4b4b4d]">
              <a href="#privasi" className="hover:underline">Kebijakan Privasi</a>
              <span>|</span>
              <a href="#syarat" className="hover:underline">Syarat Penggunaan</a>
              <span>|</span>
              <a href="#legal" className="hover:underline">Legalitas</a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#1d1d1f] shrink-0 font-normal">
            <Globe className="w-3.5 h-3.5" />
            <span>Indonesia (Bahasa Indonesia)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
