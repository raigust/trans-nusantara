export type BusClass = 'First Class Sleeper' | 'Royal Sleeper' | 'Super Top Double Decker' | 'Executive Plus' | 'VIP AC';

export interface BusFacility {
  id: string;
  name: string;
  iconName: string;
}

export interface Bus {
  id: string;
  code: string;
  name: string;
  plateNumber: string;
  model: string; // e.g. "Scania K410IB 6x2 Opticruise - Jetbus 5 Dream Coach"
  chassis: string; // Scania, Mercedes-Benz, Volvo
  karoseri: string; // Adiputro Jetbus 5, Laksana Legacy SR3, Tentrem Avante
  seatCapacity: number;
  busClass: BusClass;
  layout: '1-1' | '1-2' | '2-1' | '2-2';
  totalRows: number;
  isDoubleDecker?: boolean;
  status: 'ready' | 'in-trip' | 'maintenance';
  facilities: string[];
  imageUrl: string;
  // Live GPS Tracking Mock
  currentLocation?: string;
  speedKmH?: number;
  currentTollKm?: string;
  nextRestArea?: string;
  driverName?: string;
}

export interface Route {
  id: string;
  origin: string; // e.g. "Jakarta"
  destination: string; // e.g. "Yogyakarta"
  originTerminal: string; // e.g. "Terminal Pulo Gebang & Pool Cilandak"
  destinationTerminal: string; // e.g. "Terminal Giwangan & Pool Jombor"
  distanceKm: number;
  estimatedHours: number;
  popular?: boolean;
  via: string; // e.g. "Full Tol Trans Jawa (Cipali - Solo)"
}

export interface Schedule {
  id: string;
  routeId: string;
  route: Route;
  busId: string;
  bus: Bus;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  basePrice: number;     // in IDR
  bookedSeats: string[]; // e.g. ["1A", "1B", "3D"]
  status: 'on-time' | 'delayed' | 'boarding' | 'departed' | 'completed';
  pramugariService?: boolean;
  freeBuffetDinner?: boolean;
}

export interface Passenger {
  seatNumber: string;
  deck?: 'lower' | 'upper';
  fullName: string;
  identityNumber: string;
  phone: string;
  gender: 'L' | 'P';
}

export type PaymentMethod = 'QRIS' | 'BCA_VA' | 'MANDIRI_VA' | 'BRI_VA' | 'GOPAY' | 'OVO';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. TN-79281
  scheduleId: string;
  schedule: Schedule;
  passengers: Passenger[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  paidAt?: string;
  createdAt: string;
  boarded: boolean;
  boardedAt?: string;
}

export interface FleetCategoryInfo {
  name: BusClass;
  subtitle: string;
  tagline: string;
  description: string;
  chassisInfo: string;
  priceStart: number;
  features: string[];
  imageUrl: string;
  interiorImageUrl: string;
}
