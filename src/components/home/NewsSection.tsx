import React from 'react';
import { ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import { NEWS_AND_EVENTS, TESTIMONIALS } from '../../data/mockData';
import { sounds } from '../../utils/soundEffects';

export const NewsSection: React.FC = () => {
  return (
    <section className="w-full bg-[#ffffff] py-20 px-4 sm:px-6 text-[#1d1d1f] border-t border-[#e0e0e0]">
      <div className="max-w-[1024px] mx-auto space-y-16">
        
        {/* 1. Verified Traveler Stories (Apple Store Utility Card 18px radius) */}
        <div>
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs font-semibold text-[#0066cc] uppercase tracking-wider">
              Ulasan Penumpang
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Dipercaya oleh ribuan pelancong setiap hari.
            </h3>
            <p className="text-sm text-[#7a7a7a]">
              Penilaian nyata 4.96 bintang dari para profesional, wisatawan, dan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="apple-utility-card flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover bg-[#f0f0f0]"
                    />
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#1d1d1f]">{t.name}</h4>
                      <p className="text-[12px] text-[#7a7a7a]">{t.date}</p>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#333333] leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#7a7a7a]">
                  <span className="truncate max-w-[180px]">{t.role}</span>
                  <div className="flex text-[#1d1d1f]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} className="text-[#0066cc] text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. News & Travel Guide (Apple Editorial Cards on White) */}
        <div className="pt-8 border-t border-[#e0e0e0]">
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs font-semibold text-[#0066cc] uppercase tracking-wider">
              Warta & Panduan Tol
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Informasi terkini untuk perjalanan Anda.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {NEWS_AND_EVENTS.map((item) => (
              <div
                key={item.id}
                onClick={() => sounds.playClick()}
                className="apple-utility-card flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="rounded-[8px] overflow-hidden bg-[#fafafc] mb-4 aspect-[16/10] border border-[#f0f0f0]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-[#0066cc] uppercase tracking-wider block mb-1">
                    {item.category} &bull; {item.date}
                  </span>

                  <h4 className="text-[16px] font-semibold text-[#1d1d1f] leading-snug group-hover:text-[#0066cc] transition-colors line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-[13px] text-[#7a7a7a] mt-2 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#0066cc] font-medium">
                  <span>Baca selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
