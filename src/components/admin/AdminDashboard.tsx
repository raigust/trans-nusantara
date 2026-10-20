import React, { useState, useEffect } from 'react';
import { 
  Shield, Bus, Calendar, Ticket, CheckCircle2, AlertTriangle, 
  Plus, Search, RefreshCw, DollarSign, Users, Clock, QrCode, 
  Trash2, Edit3, ArrowLeft, Check, X, ChevronRight 
} from 'lucide-react';
import { Bus as BusType, Schedule, Booking, Route, BusClass } from '../../types';
import { StorageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';

interface AdminDashboardProps {
  onOpenETicket: (booking: Booking) => void;
  onNavigateHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenETicket, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'scanner' | 'fleet' | 'schedules'>('bookings');
  
  // Data state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  // Search & filter
  const [bookingSearch, setBookingSearch] = useState('');

  // Scanner state
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; booking?: Booking } | null>(null);

  // New Bus Form Modal
  const [isAddingBus, setIsAddingBus] = useState(false);
  const [newBusName, setNewBusName] = useState('');
  const [newBusCode, setNewBusCode] = useState('');
  const [newBusPlate, setNewBusPlate] = useState('');
  const [newBusModel, setNewBusModel] = useState('Scania K410IB Opticruise - Jetbus 5');
  const [newBusClass, setNewBusClass] = useState<BusClass>('Royal Sleeper');
  const [newBusCapacity, setNewBusCapacity] = useState(22);

  // New Schedule Form Modal
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchRouteId, setNewSchRouteId] = useState('');
  const [newSchBusId, setNewSchBusId] = useState('');
  const [newSchDate, setNewSchDate] = useState('2026-10-25');
  const [newSchDepTime, setNewSchDepTime] = useState('08:00');
  const [newSchArrTime, setNewSchArrTime] = useState('16:00');
  const [newSchPrice, setNewSchPrice] = useState(450000);

  const loadData = () => {
    const bks = StorageService.getBookings();
    const bs = StorageService.getBuses();
    const schs = StorageService.getSchedules();
    const rts = StorageService.getRoutes();
    setBookings(bks);
    setBuses(bs);
    setSchedules(schs);
    setRoutes(rts);
    if (rts.length > 0) setNewSchRouteId(prev => prev || rts[0].id);
    if (bs.length > 0) setNewSchBusId(prev => prev || bs[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!scanCode.trim()) return;

    const result = StorageService.checkInPassenger(scanCode.trim());
    if (result.success) {
      sounds.playSuccess();
    } else {
      sounds.playSeatSelect();
    }
    setScanResult(result);
    loadData();
  };

  const handleToggleBusStatus = (busId: string, currentStatus: string) => {
    sounds.playClick();
    const nextStatus = currentStatus === 'ready' ? 'in-trip' : currentStatus === 'in-trip' ? 'maintenance' : 'ready';
    StorageService.updateBusStatus(busId, nextStatus as any);
    loadData();
  };

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!newBusName || !newBusPlate) return;

    StorageService.addBus({
      name: newBusName,
      code: newBusCode || `TN-${Math.floor(100 + Math.random() * 900)}`,
      plateNumber: newBusPlate,
      model: newBusModel,
      chassis: 'Scania / Mercedes-Benz Euro 5',
      karoseri: 'Adiputro / Laksana Karoseri',
      seatCapacity: newBusCapacity,
      busClass: newBusClass,
      layout: '1-1',
      totalRows: Math.ceil(newBusCapacity / 2),
      isDoubleDecker: newBusClass.includes('Double Decker'),
      status: 'ready',
      facilities: ['WiFi Starlink', 'Voucher Prasmanan Resto', 'AC HEPA Filter'],
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
      currentLocation: 'Pool Pusat Cilandak Jakarta',
      speedKmH: 0,
      currentTollKm: 'Garasi Pusat',
      nextRestArea: 'Siap Beroperasi'
    });

    setIsAddingBus(false);
    setNewBusName('');
    setNewBusPlate('');
    loadData();
    sounds.playSuccess();
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const routeId = newSchRouteId || (routes[0]?.id || '');
    const busId = newSchBusId || (buses[0]?.id || '');
    if (!routeId || !busId) return;

    StorageService.addSchedule({
      routeId,
      busId,
      departureDate: newSchDate,
      departureTime: newSchDepTime,
      arrivalTime: newSchArrTime,
      basePrice: newSchPrice,
    });

    setIsAddingSchedule(false);
    loadData();
    sounds.playSuccess();
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    sounds.playClick();
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
      StorageService.deleteSchedule(scheduleId);
      loadData();
      sounds.playSuccess();
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.contactName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.schedule.route.destination.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalPassengers = bookings.reduce((sum, b) => sum + b.passengers.length, 0);
  const boardedCount = bookings.filter(b => b.boarded).length;
  const activeBuses = buses.filter(b => b.status === 'ready').length;

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 font-sans text-[#1d1d1f] text-left">
      <div className="max-w-[1024px] mx-auto space-y-6">
        
        {/* Top Breadcrumb & Return to Home */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => {
              sounds.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="text-xs text-[#0066cc] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Utama</span>
          </button>

          <span className="text-xs text-[#7a7a7a]">
            Endpoint Operasional: <code className="bg-[#fafafc] px-2 py-0.5 rounded border border-[#e0e0e0]">/admin</code>
          </span>
        </div>

        {/* Header Hero Card */}
        <div className="bg-white rounded-[20px] border border-[#e0e0e0] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                  TransNusantara Admin Operations
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f8ed] text-[#008a05]">
                  Sistem Aktif
                </span>
              </div>
              <p className="text-xs text-[#7a7a7a] mt-0.5">
                Kelola manifest tiket penumpang, scanner boarding QR gate, kesiapan armada, dan rute perjalanan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); loadData(); }}
              className="apple-btn-secondary !text-xs !py-1.5 !px-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Segarkan Data</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-[16px] bg-white border border-[#e0e0e0] shadow-sm">
            <span className="text-[11px] text-[#7a7a7a] uppercase tracking-wider block">Total Pendapatan</span>
            <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-[#7a7a7a] mt-0.5 block">{bookings.length} transaksi tiket lunas</span>
          </div>

          <div className="p-5 rounded-[16px] bg-white border border-[#e0e0e0] shadow-sm">
            <span className="text-[11px] text-[#7a7a7a] uppercase tracking-wider block">Total Penumpang</span>
            <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              {totalPassengers} Orang
            </div>
            <span className="text-[11px] text-[#008a05] mt-0.5 block font-medium">{boardedCount} telah check-in boarding</span>
          </div>

          <div className="p-5 rounded-[16px] bg-white border border-[#e0e0e0] shadow-sm">
            <span className="text-[11px] text-[#7a7a7a] uppercase tracking-wider block">Kesiapan Armada</span>
            <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              {activeBuses} / {buses.length} Unit
            </div>
            <span className="text-[11px] text-[#7a7a7a] mt-0.5 block">Standar Euro 5 & Retarder</span>
          </div>

          <div className="p-5 rounded-[16px] bg-white border border-[#e0e0e0] shadow-sm">
            <span className="text-[11px] text-[#7a7a7a] uppercase tracking-wider block">Jadwal Keberangkatan</span>
            <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              {schedules.length} Jadwal
            </div>
            <span className="text-[11px] text-[#7a7a7a] mt-0.5 block">Lintas Tol Trans Jawa</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e0e0e0] pb-3">
          {[
            { id: 'bookings', label: 'Daftar Reservasi', icon: Ticket, count: bookings.length },
            { id: 'scanner', label: 'Scanner Boarding Gate', icon: QrCode },
            { id: 'fleet', label: 'Manajemen Armada', icon: Bus, count: buses.length },
            { id: 'schedules', label: 'Jadwal & Tarif', icon: Calendar, count: schedules.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'bg-white text-[#7a7a7a] border border-[#e0e0e0] hover:text-[#1d1d1f]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#fafafc] text-[#1d1d1f]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESERVATIONS / BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Cari kode booking atau nama penumpang..."
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                />
                <Search className="w-3.5 h-3.5 text-[#7a7a7a] absolute left-3 top-2.5" />
              </div>
              <span className="text-xs text-[#7a7a7a]">
                Menampilkan {filteredBookings.length} dari {bookings.length} reservasi
              </span>
            </div>

            {/* Bookings Table */}
            <div className="rounded-[18px] bg-white border border-[#e0e0e0] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafafc] text-[#7a7a7a] uppercase tracking-wider font-semibold border-b border-[#e0e0e0]">
                    <tr>
                      <th className="p-4">Kode Booking</th>
                      <th className="p-4">Pemesan</th>
                      <th className="p-4">Rute & Waktu</th>
                      <th className="p-4">Kursi</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#fafafc] transition-colors">
                        <td className="p-4 font-semibold text-[#0066cc]">
                          {b.bookingCode}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#1d1d1f]">{b.contactName}</div>
                          <div className="text-[11px] text-[#7a7a7a]">{b.contactPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-[#1d1d1f]">
                            {b.schedule.route.origin} &rarr; {b.schedule.route.destination}
                          </div>
                          <div className="text-[11px] text-[#7a7a7a]">
                            {b.schedule.departureDate} ({b.schedule.departureTime} WIB)
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#fafafc] text-[#1d1d1f] border border-[#e0e0e0] mr-1.5">
                            {b.schedule.bus.busClass}
                          </span>
                          <span className="font-medium text-[#1d1d1f]">
                            {b.passengers.map(p => p.seatNumber).join(', ')}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#1d1d1f]">
                          Rp {b.totalPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          {b.boarded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#e6f8ed] text-[#008a05]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Boarded</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#fafafc] text-[#7a7a7a] border border-[#e0e0e0]">
                              <Clock className="w-3 h-3" />
                              <span>Siap Boarding</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onOpenETicket(b)}
                            className="apple-btn-secondary !text-xs !py-1 !px-2.5"
                          >
                            Buka Tiket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOARDING GATE SCANNER */}
        {activeTab === 'scanner' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="p-8 rounded-[20px] bg-white border border-[#e0e0e0] text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#fafafc] text-[#1d1d1f] flex items-center justify-center mx-auto border border-[#e0e0e0]">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">Scanner Gerbang Boarding Terminal</h3>
                <p className="text-xs text-[#7a7a7a] max-w-sm mx-auto mt-1">
                  Pindai QR code tiket penumpang dengan barcode scanner atau masukkan kode booking secara manual.
                </p>
              </div>

              <form onSubmit={handleScanSubmit} className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: TN-98241"
                    className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#e0e0e0] text-center font-mono text-base font-semibold text-[#1d1d1f] tracking-widest focus:outline-none focus:border-[#0066cc] uppercase"
                  />
                  <button
                    type="submit"
                    className="apple-btn-primary !text-xs !py-2 !px-5"
                  >
                    Check-in
                  </button>
                </div>
              </form>

              {/* Scan Results */}
              {scanResult && (
                <div className={`p-4 rounded-xl border text-left text-xs space-y-2 animate-in fade-in ${
                  scanResult.success 
                    ? 'bg-[#e6f8ed] border-[#bbf7d0] text-[#008a05]' 
                    : 'bg-[#fff1f2] border-[#ffd1da] text-[#c13515]'
                }`}>
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {scanResult.success ? <CheckCircle2 className="w-4 h-4 text-[#008a05]" /> : <AlertTriangle className="w-4 h-4 text-[#c13515]" />}
                    <span>{scanResult.message}</span>
                  </div>

                  {scanResult.booking && (
                    <div className="pt-2 border-t border-black/10 text-[#1d1d1f] space-y-1">
                      <div>Penumpang: <strong>{scanResult.booking.contactName}</strong></div>
                      <div>Kursi: <strong>{scanResult.booking.passengers.map(p => p.seatNumber).join(', ')}</strong></div>
                      <div>Rute: <strong>{scanResult.booking.schedule.route.origin} &rarr; {scanResult.booking.schedule.route.destination}</strong></div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample codes */}
              <div className="pt-4 border-t border-[#e0e0e0] text-xs text-[#7a7a7a] flex items-center justify-center gap-2 flex-wrap">
                <span>Coba kode booking:</span>
                {bookings.slice(0, 3).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setScanCode(b.bookingCode);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#fafafc] hover:bg-[#e0e0e0] text-[#1d1d1f] font-semibold text-xs border border-[#e0e0e0]"
                  >
                    {b.bookingCode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLEET MANAGEMENT */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-[#1d1d1f]">Daftar Armada Bus ({buses.length} Unit)</h3>
                <p className="text-xs text-[#7a7a7a]">Atur kesiapan armada, inspeksi rem, dan jadwal perawatan</p>
              </div>
              <button
                onClick={() => setIsAddingBus(true)}
                className="apple-btn-primary !text-xs !py-1.5 !px-3.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bus Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="apple-utility-card flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#1d1d1f]">{bus.code}</span>
                      <button
                        onClick={() => handleToggleBusStatus(bus.id, bus.status)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider cursor-pointer ${
                          bus.status === 'ready'
                            ? 'bg-[#e6f8ed] text-[#008a05]'
                            : bus.status === 'in-trip'
                            ? 'bg-[#eff6ff] text-[#1d4ed8]'
                            : 'bg-[#fff1f2] text-[#c13515]'
                        }`}
                      >
                        {bus.status === 'ready' ? 'Siap Jalan' : bus.status === 'in-trip' ? 'Dalam Perjalanan' : 'Maintenance'}
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#1d1d1f] text-base">{bus.name}</h4>
                      <div className="text-xs text-[#7a7a7a] mt-0.5">{bus.plateNumber}</div>
                      <div className="text-xs text-[#7a7a7a] mt-1">{bus.model}</div>
                    </div>

                    <div className="flex items-center gap-2 text-xs pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#fafafc] text-[#1d1d1f] text-[11px] border border-[#e0e0e0]">
                        {bus.busClass}
                      </span>
                      <span className="text-[#7a7a7a]">Kapasitas: {bus.seatCapacity} Kursi</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-xs">
                    <span className="text-[#7a7a7a]">Klik status untuk ubah</span>
                    <button
                      onClick={() => handleToggleBusStatus(bus.id, bus.status)}
                      className="text-[#0066cc] font-medium hover:underline"
                    >
                      Ubah Status &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULES */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-[#1d1d1f]">Jadwal & Rute Keberangkatan</h3>
                <p className="text-xs text-[#7a7a7a]">Atur jam keberangkatan dan penetapan tarif dasar per kursi</p>
              </div>
              <button
                onClick={() => setIsAddingSchedule(true)}
                className="apple-btn-primary !text-xs !py-1.5 !px-3.5"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Jadwal Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="apple-utility-card flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fafafc] text-[#1d1d1f] border border-[#e0e0e0]">
                        {sch.bus.busClass}
                      </span>
                      <span className="text-xs font-semibold text-[#1d1d1f]">
                        Rp {sch.basePrice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base text-[#1d1d1f]">
                        {sch.route.origin} &rarr; {sch.route.destination}
                      </h4>
                      <div className="text-xs text-[#7a7a7a] mt-0.5">
                        {sch.departureDate} &bull; Berangkat {sch.departureTime} WIB (Tiba {sch.arrivalTime} WIB)
                      </div>
                      <div className="text-xs text-[#7a7a7a] mt-0.5">
                        Armada: {sch.bus.name} ({sch.bus.plateNumber})
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-xs">
                    <span className="text-[#7a7a7a]">
                      Terisi: {sch.bookedSeats?.length || 0} / {sch.bus.seatCapacity} Kursi
                    </span>
                    <button
                      onClick={() => handleDeleteSchedule(sch.id)}
                      className="text-[#c13515] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Jadwal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Add Bus */}
      {isAddingBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[20px] border border-[#e0e0e0] shadow-xl p-6 max-w-md w-full space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
              <h3 className="font-semibold text-base text-[#1d1d1f]">Tambah Armada Bus Baru</h3>
              <button onClick={() => setIsAddingBus(false)} className="w-8 h-8 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[#7a7a7a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Nama Bus</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nusantara Super Decker"
                  value={newBusName}
                  onChange={(e) => setNewBusName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Nomor Polisi (Plat)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 7789 TNE"
                  value={newBusPlate}
                  onChange={(e) => setNewBusPlate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Kelas Layanan</label>
                <select
                  value={newBusClass}
                  onChange={(e) => setNewBusClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                >
                  <option value="First Class Sleeper">First Class Sleeper (180° Flatbed)</option>
                  <option value="Royal Sleeper">Royal Sleeper Suites</option>
                  <option value="Super Top Double Decker">Super Top Double Decker</option>
                  <option value="Executive Plus">Executive Plus</option>
                </select>
              </div>

              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Kapasitas Kursi</label>
                <input
                  type="number"
                  value={newBusCapacity}
                  onChange={(e) => setNewBusCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBus(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#e0e0e0] text-[#7a7a7a] hover:bg-[#fafafc]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#0066cc] hover:bg-[#0071e3] text-white font-medium"
                >
                  Simpan Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Schedule */}
      {isAddingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[20px] border border-[#e0e0e0] shadow-xl p-6 max-w-md w-full space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
              <h3 className="font-semibold text-base text-[#1d1d1f]">Buat Jadwal Keberangkatan Baru</h3>
              <button onClick={() => setIsAddingSchedule(false)} className="w-8 h-8 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[#7a7a7a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Rute</label>
                <select
                  value={newSchRouteId}
                  onChange={(e) => setNewSchRouteId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.origin} &rarr; {r.destination} ({r.estimatedHours} Jam Tol)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Armada Bus</label>
                <select
                  value={newSchBusId}
                  onChange={(e) => setNewSchBusId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.plateNumber} - {b.busClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#7a7a7a] mb-1 font-semibold">Jam Berangkat</label>
                  <input
                    type="time"
                    value={newSchDepTime}
                    onChange={(e) => setNewSchDepTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>
                <div>
                  <label className="block text-[#7a7a7a] mb-1 font-semibold">Jam Tiba (Estimasi)</label>
                  <input
                    type="time"
                    value={newSchArrTime}
                    onChange={(e) => setNewSchArrTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7a7a7a] mb-1 font-semibold">Tarif Dasar (Rp / Kursi)</label>
                <input
                  type="number"
                  value={newSchPrice}
                  onChange={(e) => setNewSchPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSchedule(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#e0e0e0] text-[#7a7a7a] hover:bg-[#fafafc]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#0066cc] hover:bg-[#0071e3] text-white font-medium"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
