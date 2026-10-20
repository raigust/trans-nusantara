import React, { useState, useEffect } from 'react';
import { 
  X, Bus, ArrowRight, ArrowLeft, Check, ShieldCheck, 
  Clock, MapPin, User, CreditCard, QrCode, AlertCircle 
} from 'lucide-react';
import QRCode from 'qrcode';
import { Schedule, Passenger, PaymentMethod, Booking } from '../../types';
import { SeatMap } from './SeatMap';
import { StorageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSchedule?: Schedule | null;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  preselectedSchedule,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Passenger Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [passengersData, setPassengersData] = useState<Passenger[]>([]);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisDataUrl, setQrisDataUrl] = useState('');

  // Filter params in Step 1
  const [filterOrigin, setFilterOrigin] = useState('Semua');
  const [filterDestination, setFilterDestination] = useState('Semua');
  const [filterClass, setFilterClass] = useState('Semua');

  useEffect(() => {
    if (isOpen) {
      const allSchedules = StorageService.getSchedules();
      setSchedules(allSchedules);

      if (preselectedSchedule) {
        setSelectedSchedule(preselectedSchedule);
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [isOpen, preselectedSchedule]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const updated = selectedSeats.map((seat, index) => {
        const existing = passengersData.find(p => p.seatNumber === seat);
        return existing || {
          seatNumber: seat,
          fullName: index === 0 && contactName ? contactName : '',
          identityNumber: '',
          phone: index === 0 && contactPhone ? contactPhone : '',
          gender: 'L' as const,
        };
      });
      setPassengersData(updated);
    } else {
      setPassengersData([]);
    }
  }, [selectedSeats]);

  useEffect(() => {
    if (step === 4 && selectedSchedule) {
      const payload = `00020101021226670014ID.TRANSNUSANTARA520458125802ID5914TRANSNUSANTARA6007JAKARTA62070703A016304`;
      QRCode.toDataURL(payload, { width: 180, margin: 1 })
        .then(url => setQrisDataUrl(url))
        .catch(e => console.error(e));
    }
  }, [step, selectedSchedule]);

  if (!isOpen) return null;

  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        alert('Maksimal pemesanan adalah 4 kursi per transaksi.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleUpdatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const copy = [...passengersData];
    copy[index] = { ...copy[index], [field]: value };
    setPassengersData(copy);
  };

  const handleConfirmPayment = () => {
    if (!selectedSchedule) return;

    for (const p of passengersData) {
      if (!p.fullName.trim() || !p.identityNumber.trim()) {
        alert(`Harap lengkapi nama lengkap dan NIK untuk kursi ${p.seatNumber}!`);
        return;
      }
    }

    if (!contactName.trim() || !contactPhone.trim()) {
      alert('Harap lengkapi nama pemesan dan nomor WhatsApp!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const createdBooking = StorageService.createBooking({
          scheduleId: selectedSchedule.id,
          passengers: passengersData,
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim() || `${contactName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          contactPhone: contactPhone.trim(),
          paymentMethod,
        });

        setIsProcessing(false);
        sounds.playSuccess();
        onBookingSuccess(createdBooking);
        onClose();
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || 'Gagal memproses tiket');
      }
    }, 700);
  };

  const filteredSchedules = schedules.filter(sch => {
    if (filterOrigin !== 'Semua' && sch.route.origin !== filterOrigin) return false;
    if (filterDestination !== 'Semua' && sch.route.destination !== filterDestination) return false;
    if (filterClass !== 'Semua' && sch.bus.busClass !== filterClass) return false;
    return true;
  });

  const totalPrice = selectedSchedule ? selectedSchedule.basePrice * selectedSeats.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-[24px] border border-[#e0e0e0] shadow-2xl overflow-hidden my-6 text-[#1d1d1f] flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f5f5f7] border-b border-[#e0e0e0] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base text-[#1d1d1f]">Pemesanan Tiket TransNusantara</h3>
                <p className="text-xs text-[#7a7a7a]">
                  {step === 1 && 'Pilih Jadwal & Jam Keberangkatan'}
                  {step === 2 && `Konfigurasi Kursi: ${selectedSchedule?.route.origin} → ${selectedSchedule?.route.destination}`}
                  {step === 3 && 'Lengkapi Data Penumpang'}
                  {step === 4 && 'Penyelesaian Pembayaran'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#d2d2d7] hover:bg-[#ffffff] flex items-center justify-center text-[#1d1d1f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Option Chips (Apple Configurator Style) */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { num: 1, title: '1. Jadwal' },
              { num: 2, title: '2. Kursi' },
              { num: 3, title: '3. Data' },
              { num: 4, title: '4. Bayar' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1.5 px-2 rounded-full text-xs text-center transition-all ${
                  step === s.num
                    ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                    : step > s.num
                    ? 'bg-white text-[#0066cc] font-medium border border-[#0066cc]'
                    : 'bg-white text-[#7a7a7a] border border-[#e0e0e0]'
                }`}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {/* STEP 1: PILIH JADWAL */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] text-left">
                <div>
                  <label className="text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wider block mb-1">
                    Kota Asal
                  </label>
                  <select
                    value={filterOrigin}
                    onChange={(e) => setFilterOrigin(e.target.value)}
                    className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  >
                    <option value="Semua">Semua Kota Asal</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Bandung">Bandung</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wider block mb-1">
                    Kota Tujuan
                  </label>
                  <select
                    value={filterDestination}
                    onChange={(e) => setFilterDestination(e.target.value)}
                    className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  >
                    <option value="Semua">Semua Kota Tujuan</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Solo">Solo</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Denpasar (Bali)">Denpasar (Bali)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wider block mb-1">
                    Kelas Bus
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="First Class Sleeper">First Class Sleeper (180° Flatbed)</option>
                    <option value="Royal Sleeper">Royal Sleeper Suites</option>
                    <option value="Super Top Double Decker">Super Top Double Decker</option>
                    <option value="Executive Plus">Executive Plus</option>
                  </select>
                </div>
              </div>

              {/* Schedule List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#7a7a7a]">
                  <span>Ditemukan <strong>{filteredSchedules.length}</strong> Jadwal Keberangkatan</span>
                  <span>Waktu Indonesia Barat (WIB)</span>
                </div>

                {filteredSchedules.map((sch) => {
                  const bookedCount = sch.bookedSeats?.length || 0;
                  const availableCount = sch.bus.seatCapacity - bookedCount;

                  return (
                    <div
                      key={sch.id}
                      className="p-5 rounded-[16px] bg-white border border-[#e0e0e0] hover:border-[#0066cc] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Left: Timing & Route */}
                      <div className="space-y-2 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
                            {sch.bus.busClass}
                          </span>
                          <span className="text-xs text-[#7a7a7a]">
                            {sch.bus.name} &bull; {sch.bus.model.split('-')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-2xl font-semibold text-[#1d1d1f]">{sch.departureTime}</span>
                            <span className="text-xs text-[#7a7a7a] block">{sch.route.origin}</span>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-[#7a7a7a] font-normal">{sch.route.estimatedHours} Jam</span>
                            <div className="w-16 h-0.5 bg-[#e0e0e0] relative my-1">
                              <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#0066cc]" />
                            </div>
                            <span className="text-[10px] text-[#34c759] font-medium">Tol Trans Jawa</span>
                          </div>

                          <div>
                            <span className="text-2xl font-semibold text-[#1d1d1f]">{sch.arrivalTime}</span>
                            <span className="text-xs text-[#7a7a7a] block">{sch.route.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#7a7a7a] pt-1">
                          <span>Prasmanan Resto</span>
                          <span>&bull;</span>
                          <span>WiFi Starlink</span>
                          <span>&bull;</span>
                          <span>USB 45W</span>
                        </div>
                      </div>

                      {/* Right: Price & CTA */}
                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#f0f0f0] gap-2">
                        <div className="text-left md:text-right">
                          <span className="text-[11px] text-[#7a7a7a] block">Tarif Tiket</span>
                          <span className="text-xl font-semibold text-[#1d1d1f]">
                            Rp {sch.basePrice.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] text-[#34c759] block mt-0.5 font-medium">
                            Tersisa {availableCount} Kursi
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSchedule(sch);
                            setStep(2);
                          }}
                          className="apple-btn-primary !text-xs !py-2 !px-4"
                        >
                          <span>Pilih Kursi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PILIH KURSI */}
          {step === 2 && selectedSchedule && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] text-left">
                <div>
                  <span className="text-xs text-[#7a7a7a]">Rute Keberangkatan</span>
                  <div className="font-semibold text-sm text-[#1d1d1f]">
                    {selectedSchedule.route.origin} &rarr; {selectedSchedule.route.destination} ({selectedSchedule.departureDate})
                  </div>
                  <div className="text-xs text-[#0066cc] mt-0.5">
                    Berangkat {selectedSchedule.departureTime} WIB &bull; {selectedSchedule.bus.busClass}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#7a7a7a]">Tarif Kursi</span>
                  <div className="font-semibold text-base text-[#1d1d1f]">
                    Rp {selectedSchedule.basePrice.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <SeatMap
                schedule={selectedSchedule}
                selectedSeats={selectedSeats}
                onToggleSeat={handleToggleSeat}
                maxSeats={4}
              />
            </div>
          )}

          {/* STEP 3: DATA PENUMPANG */}
          {step === 3 && selectedSchedule && (
            <div className="space-y-6 text-left">
              <div className="p-5 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e0e0e0]">
                  <User className="w-4 h-4 text-[#0066cc]" />
                  <h4 className="text-sm font-semibold text-[#1d1d1f]">Data Pemesan Tiket (E-Tiket & WhatsApp)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
                      Nama Lengkap Pemesan *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
                      No. WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
                      Email Konfirmasi
                    </label>
                    <input
                      type="email"
                      placeholder="budi@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>
                </div>
              </div>

              {/* Manifest Penumpang */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#1d1d1f]">
                  Daftar Manifest Penumpang ({selectedSeats.length} Orang)
                </h4>

                {passengersData.map((p, idx) => (
                  <div key={p.seatNumber} className="p-4 rounded-xl border border-[#e0e0e0] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0066cc]">
                        Penumpang Kursi {p.seatNumber}
                      </span>
                      <span className="text-[11px] text-[#7a7a7a]">Sesuai identitas KTP / Paspor</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[#7a7a7a] block mb-1">Nama Lengkap Penumpang *</label>
                        <input
                          type="text"
                          placeholder="Nama sesuai KTP"
                          value={p.fullName}
                          onChange={(e) => handleUpdatePassenger(idx, 'fullName', e.target.value)}
                          className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#7a7a7a] block mb-1">Nomor KTP / NIK *</label>
                        <input
                          type="text"
                          placeholder="16 digit NIK"
                          value={p.identityNumber}
                          onChange={(e) => handleUpdatePassenger(idx, 'identityNumber', e.target.value)}
                          className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#7a7a7a] block mb-1">Jenis Kelamin</label>
                        <select
                          value={p.gender}
                          onChange={(e) => handleUpdatePassenger(idx, 'gender', e.target.value)}
                          className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PEMBAYARAN */}
          {step === 4 && selectedSchedule && (
            <div className="space-y-6 text-left">
              <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-[#1d1d1f]">
                    {selectedSchedule.route.origin} &rarr; {selectedSchedule.route.destination}
                  </h4>
                  <p className="text-xs text-[#7a7a7a] mt-0.5">
                    {selectedSchedule.departureDate} &bull; {selectedSchedule.departureTime} WIB &bull; Kursi {selectedSeats.join(', ')}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-[#7a7a7a] block">Total Pembayaran</span>
                  <span className="text-xl font-semibold text-[#0066cc]">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] mb-3">
                  Pilih Saluran Pembayaran
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'QRIS', label: 'QRIS Instan' },
                    { id: 'Bank Transfer BCA', label: 'BCA Virtual Account' },
                    { id: 'Bank Transfer Mandiri', label: 'Mandiri VA' },
                    { id: 'Agen Loket', label: 'Bayar di Agen' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { sounds.playClick(); setPaymentMethod(m.id as PaymentMethod); }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#0066cc] bg-[#f0f6ff] text-[#0066cc] font-semibold'
                          : 'border-[#e0e0e0] bg-white text-[#7a7a7a] hover:border-[#c0c0c0]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1.5 text-[#0066cc]" />
                      <span className="text-xs block text-[#1d1d1f]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'QRIS' && (
                <div className="p-6 rounded-2xl border border-[#e0e0e0] bg-[#ffffff] text-center max-w-sm mx-auto shadow-sm">
                  <span className="text-[11px] text-[#7a7a7a] block mb-2 font-medium">
                    Pindai dengan aplikasi M-Banking atau E-Wallet apa saja:
                  </span>
                  {qrisDataUrl ? (
                    <img
                      src={qrisDataUrl}
                      alt="QRIS Code"
                      className="w-40 h-40 mx-auto border border-[#e0e0e0] p-2 rounded-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 mx-auto bg-[#f5f5f7] rounded-xl animate-pulse" />
                  )}
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-3">
                    NMID: ID10202677890TRANS
                  </p>
                  <p className="text-[11px] text-[#34c759] mt-1 font-medium">
                    Verifikasi pembayaran otomatis dalam 3 detik
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#f5f5f7] border-t border-[#e0e0e0] flex items-center justify-between gap-4 shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setStep((prev) => (prev - 1) as any);
                }}
                className="apple-btn-secondary !text-xs !py-2 !px-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {selectedSeats.length > 0 && (
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-[#7a7a7a] block">{selectedSeats.length} Kursi ({selectedSeats.join(', ')})</span>
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            )}

            {step === 1 && selectedSchedule && (
              <button
                type="button"
                onClick={() => { sounds.playClick(); setStep(2); }}
                className="apple-btn-primary !text-xs !py-2 !px-5"
              >
                <span>Pilih Kursi &rarr;</span>
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  if (selectedSeats.length === 0) return;
                  sounds.playClick();
                  setStep(3);
                }}
                className={`apple-btn-primary !text-xs !py-2 !px-5 ${
                  selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Lanjut Isi Data ({selectedSeats.length} Kursi) &rarr;</span>
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => { sounds.playClick(); setStep(4); }}
                className="apple-btn-primary !text-xs !py-2 !px-5"
              >
                <span>Lanjut ke Pembayaran &rarr;</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="apple-btn-primary !text-xs !py-2 !px-5"
              >
                {isProcessing ? (
                  <span>Memproses E-Tiket...</span>
                ) : (
                  <>
                    <span>Bayar & Terbitkan Tiket</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
