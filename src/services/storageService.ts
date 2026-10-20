import { Bus, Route, Schedule, Booking, Passenger, PaymentMethod } from '../types';
import { INITIAL_BUSES, INITIAL_ROUTES, INITIAL_SCHEDULES, INITIAL_BOOKINGS } from '../data/mockData';

const STORAGE_KEYS = {
  BUSES: 'tn_buses_v1',
  ROUTES: 'tn_routes_v1',
  SCHEDULES: 'tn_schedules_v1',
  BOOKINGS: 'tn_bookings_v1',
};

export class StorageService {
  // Load data with fallback to mock data
  static getBuses(): Bus[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUSES);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    this.saveBuses(INITIAL_BUSES);
    return INITIAL_BUSES;
  }

  static saveBuses(buses: Bus[]): void {
    localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
  }

  static addBus(bus: Omit<Bus, 'id'>): Bus {
    const buses = this.getBuses();
    const newBus: Bus = {
      ...bus,
      id: `bus-${Date.now()}`
    };
    buses.unshift(newBus);
    this.saveBuses(buses);
    return newBus;
  }

  static updateBus(id: string, updates: Partial<Bus>): Bus | null {
    const buses = this.getBuses();
    const index = buses.findIndex(b => b.id === id);
    if (index === -1) return null;
    buses[index] = { ...buses[index], ...updates };
    this.saveBuses(buses);
    return buses[index];
  }

  static updateBusStatus(id: string, status: 'ready' | 'in-trip' | 'maintenance'): Bus | null {
    return this.updateBus(id, { status });
  }

  static getRoutes(): Route[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    this.saveRoutes(INITIAL_ROUTES);
    return INITIAL_ROUTES;
  }

  static saveRoutes(routes: Route[]): void {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  }

  static addRoute(route: Omit<Route, 'id'>): Route {
    const routes = this.getRoutes();
    const newRoute: Route = {
      ...route,
      id: `route-${Date.now()}`
    };
    routes.push(newRoute);
    this.saveRoutes(routes);
    return newRoute;
  }

  static getSchedules(): Schedule[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    this.saveSchedules(INITIAL_SCHEDULES);
    return INITIAL_SCHEDULES;
  }

  static saveSchedules(schedules: Schedule[]): void {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }

  static addSchedule(scheduleData: {
    routeId: string;
    busId: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    basePrice: number;
  }): Schedule {
    const routes = this.getRoutes();
    const buses = this.getBuses();
    const route = routes.find(r => r.id === scheduleData.routeId) || routes[0];
    const bus = buses.find(b => b.id === scheduleData.busId) || buses[0];

    const newSchedule: Schedule = {
      id: `sch-${Date.now()}`,
      routeId: scheduleData.routeId,
      route,
      busId: scheduleData.busId,
      bus,
      departureDate: scheduleData.departureDate,
      departureTime: scheduleData.departureTime,
      arrivalTime: scheduleData.arrivalTime,
      basePrice: scheduleData.basePrice,
      bookedSeats: [],
      status: 'on-time'
    };

    const schedules = this.getSchedules();
    schedules.unshift(newSchedule);
    this.saveSchedules(schedules);
    return newSchedule;
  }

  static deleteSchedule(id: string): boolean {
    const schedules = this.getSchedules();
    const filtered = schedules.filter(s => s.id !== id);
    this.saveSchedules(filtered);
    return true;
  }

  static searchSchedules(params: {
    origin?: string;
    destination?: string;
    date?: string;
    busClass?: string;
  }): Schedule[] {
    const schedules = this.getSchedules();
    return schedules.filter(sch => {
      if (params.origin && params.origin !== 'Semua' && sch.route.origin.toLowerCase() !== params.origin.toLowerCase()) {
        return false;
      }
      if (params.destination && params.destination !== 'Semua' && sch.route.destination.toLowerCase() !== params.destination.toLowerCase()) {
        return false;
      }
      if (params.date && sch.departureDate !== params.date) {
        // In demo, if user picks a different date, we can still show trips or filter strictly
        // We'll show all trips matching route if date matches or allow flexible browsing
      }
      if (params.busClass && params.busClass !== 'Semua' && sch.bus.busClass !== params.busClass) {
        return false;
      }
      return true;
    });
  }

  static getBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    this.saveBookings(INITIAL_BOOKINGS);
    return INITIAL_BOOKINGS;
  }

  static saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  static getBookingByCode(code: string): Booking | null {
    const bookings = this.getBookings();
    const cleanCode = code.trim().toUpperCase();
    return bookings.find(b => b.bookingCode.toUpperCase() === cleanCode) || null;
  }

  static createBooking(data: {
    scheduleId: string;
    passengers: Passenger[];
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    paymentMethod: PaymentMethod;
  }): Booking {
    const schedules = this.getSchedules();
    const scheduleIndex = schedules.findIndex(s => s.id === data.scheduleId);
    if (scheduleIndex === -1) throw new Error('Jadwal tidak ditemukan');

    const schedule = schedules[scheduleIndex];
    const newBookedSeats = data.passengers.map(p => p.seatNumber);

    // Update booked seats on schedule
    schedule.bookedSeats = [...(schedule.bookedSeats || []), ...newBookedSeats];
    schedules[scheduleIndex] = schedule;
    this.saveSchedules(schedules);

    // Generate readable random booking code
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `TN-${randomNum}`;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingCode,
      scheduleId: schedule.id,
      schedule,
      passengers: data.passengers,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      totalPrice: schedule.basePrice * data.passengers.length,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'paid', // Instant auto-confirmed for demo simplicity or pending
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      boarded: false
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    return newBooking;
  }

  static checkInPassenger(bookingCode: string): { success: boolean; message: string; booking?: Booking } {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase());

    if (index === -1) {
      return { success: false, message: `Tiket dengan kode "${bookingCode}" tidak ditemukan!` };
    }

    const booking = bookings[index];
    if (booking.boarded) {
      return { 
        success: false, 
        message: `Peringatan: Tiket ${booking.bookingCode} sudah di-check-in sebelumnya pada ${booking.boardedAt}!`,
        booking 
      };
    }

    booking.boarded = true;
    booking.boardedAt = new Date().toLocaleString('id-ID');
    bookings[index] = booking;
    this.saveBookings(bookings);

    return { 
      success: true, 
      message: `Berhasil! Penumpang ${booking.contactName} (${booking.passengers.length} kursi) berhasil check-in.`,
      booking 
    };
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.BUSES);
    localStorage.removeItem(STORAGE_KEYS.ROUTES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  }
}
