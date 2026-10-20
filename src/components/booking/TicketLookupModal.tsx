import React, { useState } from 'react';
import { Search, X, Ticket, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface TicketLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
}

export const TicketLookupModal: React.FC<TicketLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectBooking,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setError('');
    setFoundBooking(null);

    if (!code.trim()) {
      setError('Masukkan kode booking (contoh: TN-98241)');
      return;
    }

    const booking = StorageService.getBookingByCode(code.trim());
    if (!booking) {
      setError(`Tiket dengan kode "${code.trim().toUpperCase()}" tidak ditemukan. Pastikan format kode benar.`);
    } else {
      sounds.playSuccess();
      setFoundBooking(booking);
    }
  };

  const handleQuickFill = (sampleCode: string) => {
    sounds.playClick();
    setCode(sampleCode);
    const booking = StorageService.getBookingByCode(sampleCode);
    if (booking) {
      sounds.playSuccess();
      setFoundBooking(booking);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-md bg-white rounded-[24px] border border-[#e0e0e0] shadow-2xl p-6 text-[#1d1d1f] text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#1d1d1f]">Cek Status & E-Tiket</h3>
              <p className="text-xs text-[#7a7a7a]">Lacak tiket atau unduh boarding pass</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#d2d2d7] hover:bg-[#ffffff] flex items-center justify-center text-[#1d1d1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1.5">
              Kode Booking / E-Tiket
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: TN-98241"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-white border border-[#e0e0e0] rounded-full pl-4 pr-12 py-2.5 text-sm font-semibold tracking-wider text-[#1d1d1f] uppercase focus:outline-none focus:border-[#0066cc]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#7a7a7a]">
            <span>Contoh kode aktif:</span>
            {['TN-98241', 'TN-77312', 'TN-55109'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleQuickFill(c)}
                className="px-2 py-0.5 rounded-full bg-[#f5f5f7] hover:bg-[#e0e0e0] text-[#1d1d1f] text-[11px] font-medium border border-[#e0e0e0]"
              >
                {c}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#fff1f2] border border-[#ffd1da] text-xs text-[#c13515] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Found Result Preview Card */}
        {foundBooking && (
          <div className="mt-5 p-4 rounded-xl border border-[#e0e0e0] bg-[#fafafc] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#008a05] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Tiket Valid
              </span>
              <span className="text-xs font-semibold text-[#0066cc]">
                {foundBooking.bookingCode}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#1d1d1f]">
                {foundBooking.schedule.route.origin} &rarr; {foundBooking.schedule.route.destination}
              </h4>
              <p className="text-xs text-[#7a7a7a] mt-0.5">
                {foundBooking.schedule.departureDate} &bull; {foundBooking.schedule.departureTime} WIB
              </p>
              <p className="text-xs text-[#7a7a7a] mt-0.5">
                Pemesan: <strong>{foundBooking.contactName}</strong> ({foundBooking.passengers.length} Kursi)
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onSelectBooking(foundBooking);
                onClose();
              }}
              className="w-full apple-btn-primary !text-xs !py-2"
            >
              <span>Buka E-Tiket & Boarding Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
