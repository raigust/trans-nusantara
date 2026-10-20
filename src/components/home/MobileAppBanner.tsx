import React, { useState } from 'react';
import { Download, QrCode, Check, Smartphone, ChevronRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const MobileAppBanner: React.FC = () => {
  const [downloadClicked, setDownloadClicked] = useState(false);

  const handleDownload = () => {
    sounds.playSuccess();
    setDownloadClicked(true);
    setTimeout(() => setDownloadClicked(false), 3000);
  };

  return (
    <section className="w-full bg-[#ffffff] py-20 px-4 sm:px-6 text-[#1d1d1f] border-t border-[#e0e0e0]">
      <div className="max-w-[1024px] mx-auto">
        <div className="p-8 sm:p-12 rounded-[24px] bg-[#ffffff] border border-[#e0e0e0] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
          
          <div className="md:col-span-8 space-y-3">
            <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-wider block">
              TransNusantara untuk iOS & Android
            </span>
            
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              E-Tiket offline. Notifikasi boarding di Apple Watch Anda.
            </h3>
            
            <p className="text-sm sm:text-base text-[#7a7a7a] max-w-lg leading-relaxed">
              Tambahkan boarding pass langsung ke Apple Wallet. Dapatkan update gerbang dan posisi bus tanpa perlu koneksi internet di terminal.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={handleDownload}
                className="apple-btn-primary"
              >
                <Download className="w-4 h-4" />
                <span>Unduh di App Store</span>
              </button>

              <button
                onClick={handleDownload}
                className="apple-btn-secondary"
              >
                <span>Google Play Store</span>
              </button>

              {downloadClicked && (
                <span className="text-xs font-medium text-[#34c759] flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4" /> Tautan unduhan disiapkan untuk perangkat Anda.
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-center md:justify-end">
            <div className="p-5 rounded-[18px] bg-[#fafafc] border border-[#e0e0e0] text-center shadow-sm">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center mb-2 border border-[#f0f0f0]">
                <QrCode className="w-28 h-28 text-[#1d1d1f]" />
              </div>
              <p className="text-xs font-semibold text-[#1d1d1f]">Pindai untuk Unduh</p>
              <p className="text-[11px] text-[#7a7a7a] mt-0.5">Kompatibel iOS 17+ & Android 12+</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
