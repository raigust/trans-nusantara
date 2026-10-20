import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, Printer, CheckCircle, Bus, Calendar, Clock, MapPin, 
  User, ShieldCheck, Download, Share2
} from 'lucide-react';
import { Booking } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface ETicketModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (booking) {
      const qrPayload = JSON.stringify({
        code: booking.bookingCode,
        passengers: booking.passengers.length,
        route: `${booking.schedule.route.origin}-${booking.schedule.route.destination}`,
        date: booking.schedule.departureDate,
        seats: booking.passengers.map(p => p.seatNumber).join(','),
      });

      QRCode.toDataURL(qrPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#1d1d1f',
          light: '#ffffff'
        }
      })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code error', err));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const { schedule, passengers, contactName, contactPhone, totalPrice, bookingCode } = booking;
  const { route, bus, departureDate, departureTime, arrivalTime } = schedule;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] border border-[#e0e0e0] shadow-2xl overflow-hidden my-8 text-[#1d1d1f]">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f5f5f7] border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
              <Bus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[#1d1d1f] text-base">E-Tiket & Boarding Pass Resmi</h3>
              <p className="text-xs text-[#7a7a7a]">
                Kode Booking: <strong className="text-[#0066cc] font-semibold">{bookingCode}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="apple-btn-secondary !text-xs !py-1.5 !px-3"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Tiket</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#d2d2d7] hover:bg-[#ffffff] flex items-center justify-center text-[#1d1d1f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" ref={ticketRef} className="p-6 bg-white space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#0066cc] uppercase tracking-wider block">
                TransNusantara Express &bull; {bus.busClass}
              </span>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-0.5">
                {route.origin} &rarr; {route.destination}
              </h2>
              <p className="text-xs text-[#7a7a7a] mt-0.5">
                {bus.name} ({bus.plateNumber}) &bull; Tol Trans Jawa
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f8ed] text-[#008a05]">
                <CheckCircle className="w-3.5 h-3.5" /> Terkonfirmasi
              </span>
              <p className="text-xs text-[#7a7a7a] mt-1">Status: LUNAS</p>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-[#e0e0e0] bg-white">
            <div>
              <span className="text-[11px] text-[#7a7a7a] block">Tanggal Berangkat</span>
              <strong className="text-sm text-[#1d1d1f]">{departureDate}</strong>
            </div>

            <div>
              <span className="text-[11px] text-[#7a7a7a] block">Jam Berangkat</span>
              <strong className="text-sm text-[#1d1d1f]">{departureTime} WIB</strong>
            </div>

            <div>
              <span className="text-[11px] text-[#7a7a7a] block">Estimasi Tiba</span>
              <strong className="text-sm text-[#1d1d1f]">{arrivalTime} WIB</strong>
            </div>

            <div>
              <span className="text-[11px] text-[#7a7a7a] block">Nomor Kursi</span>
              <strong className="text-sm text-[#0066cc]">
                {passengers.map(p => p.seatNumber).join(', ')}
              </strong>
            </div>
          </div>

          {/* QR Code and Manifest Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
            
            {/* QR Code */}
            <div className="sm:col-span-4 flex flex-col items-center p-4 rounded-2xl border border-[#e0e0e0] bg-[#f5f5f7] text-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Boarding"
                  className="w-36 h-36 bg-white p-2 rounded-xl border border-[#e0e0e0]"
                />
              ) : (
                <div className="w-36 h-36 bg-white rounded-xl animate-pulse" />
              )}
              <span className="text-xs font-semibold text-[#1d1d1f] mt-2 block tracking-wider">
                {bookingCode}
              </span>
              <span className="text-[10px] text-[#7a7a7a] mt-0.5">
                Pindai QR di pintu boarding terminal
              </span>
            </div>

            {/* Manifest */}
            <div className="sm:col-span-8 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7a7a7a]">
                Manifest Penumpang ({passengers.length} Orang)
              </h4>

              <div className="divide-y divide-[#e0e0e0] border border-[#e0e0e0] rounded-xl overflow-hidden bg-white">
                {passengers.map((p, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#1d1d1f] text-sm block">{p.fullName}</strong>
                      <span className="text-[#7a7a7a] text-[11px]">
                        NIK: {p.identityNumber} &bull; {p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-xs border border-[#e0e0e0]">
                      Kursi {p.seatNumber}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#7a7a7a]">
                <span>Pemesan: <strong className="text-[#1d1d1f]">{contactName} ({contactPhone})</strong></span>
                <span>Total: <strong className="text-sm text-[#0066cc]">Rp {totalPrice.toLocaleString('id-ID')}</strong></span>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] text-xs text-[#7a7a7a] space-y-1">
            <p className="font-semibold text-[#1d1d1f]">Ketentuan Perjalanan:</p>
            <p>&bull; Harap tiba di titik penjemputan terminal 30 menit sebelum jadwal keberangkatan.</p>
            <p>&bull; Voucher makan prasmanan gratis langsung terintegrasi di barcode tiket ini.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f5f5f7] border-t border-[#e0e0e0] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="apple-btn-secondary !text-xs !py-2 !px-4"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="apple-btn-primary !text-xs !py-2 !px-4"
          >
            Cetak Boarding Pass
          </button>
        </div>

      </div>
    </div>
  );
};
