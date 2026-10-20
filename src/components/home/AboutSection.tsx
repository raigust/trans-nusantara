import React from 'react';
import { ShieldCheck, Wifi, Coffee, Wind, BatteryCharging, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  const pillars = [
    {
      title: 'Keselamatan & Rem Retarder',
      desc: 'Dilengkapi sistem rem hidrolik retarder Scania & Electronic Braking System (EBS). Memastikan deselerasi halus dan aman di turunan curam maupun jalan tol basah.',
      tag: 'Standar Keselamatan',
    },
    {
      title: 'Emisi Rendah Euro 5',
      desc: 'Mesin ramah lingkungan bersertifikasi Euro 5 dengan efisiensi bahan bakar optimal dan getaran mesin yang terisolasi sempurna dari kabin penumpang.',
      tag: 'Ramah Lingkungan',
    },
    {
      title: 'Jaminan Ketepatan Waktu 99.8%',
      desc: 'Jalur prioritas via Tol Trans Jawa dari gerbang ke gerbang tanpa ngetem. Setiap perjalanan dipantau langsung dari pusat kendali operasi 24 jam.',
      tag: 'Komitmen On-Time',
    },
  ];

  return (
    <section id="inovasi" className="w-full bg-[#ffffff] py-24 px-4 sm:px-6 text-[#1d1d1f] border-t border-[#e0e0e0]">
      <div className="max-w-[1024px] mx-auto text-center space-y-4">
        
        {/* Apple 2030 / Green Badge Style */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f8ed] border border-[#bbf7d0] text-xs font-semibold text-[#008a05]">
          <span className="w-2 h-2 rounded-full bg-[#34c759]" />
          <span>Sertifikasi Kemenhub RI & Scania Global</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-[1.1] max-w-2xl mx-auto">
          Didesain untuk keselamatan. Disempurnakan untuk ketenangan Anda.
        </h2>

        <p className="text-lg text-[#7a7a7a] font-normal max-w-2xl mx-auto pt-1 leading-relaxed">
          Setiap bus menjalani pra-inspeksi 32 titik teknis sebelum roda berputar keluar dari garasi.
        </p>

        {/* 3 Pillars Grid (Apple Museum White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-left">
          {pillars.map((p, idx) => (
            <div key={idx} className="apple-utility-card flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-[#0066cc] uppercase tracking-wider block mb-2">
                  {p.tag}
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f] leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-[#7a7a7a] mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#1d1d1f] font-medium">
                <span>Inspeksi Lulus 100%</span>
                <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="pt-8">
          <button
            onClick={() => { sounds.playClick(); onOpenBooking(); }}
            className="apple-btn-primary"
          >
            <span>Pesan Tiket Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
