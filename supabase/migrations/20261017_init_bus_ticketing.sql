-- ==========================================================
-- TRANSNUSANTARA BUS TICKETING & COMPANY PROFILE DATABASE
-- Supabase / PostgreSQL Schema & Initial Seed Data
-- ==========================================================

-- 1. Create Enums
CREATE TYPE bus_class AS ENUM ('ROYAL_SLEEPER', 'EXECUTIVE_PLUS', 'SUPER_EXECUTIVE', 'VIP_CLASS');
CREATE TYPE bus_status AS ENUM ('READY', 'IN_TRIP', 'MAINTENANCE');
CREATE TYPE schedule_status AS ENUM ('ON_TIME', 'DELAYED', 'BOARDING', 'DEPARTED', 'COMPLETED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- 2. Buses Table
CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  plate_number VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(255) NOT NULL,
  seat_capacity INT NOT NULL DEFAULT 28,
  bus_class bus_class NOT NULL DEFAULT 'EXECUTIVE_PLUS',
  layout VARCHAR(20) NOT NULL DEFAULT '1-2',
  total_rows INT NOT NULL DEFAULT 10,
  status bus_status NOT NULL DEFAULT 'READY',
  facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Routes Table
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  origin_terminal VARCHAR(255) NOT NULL,
  destination_terminal VARCHAR(255) NOT NULL,
  distance_km NUMERIC(8, 2) NOT NULL,
  estimated_hours NUMERIC(4, 2) NOT NULL,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  departure_time VARCHAR(10) NOT NULL,
  arrival_time VARCHAR(10) NOT NULL,
  base_price NUMERIC(12, 2) NOT NULL,
  booked_seats TEXT[] DEFAULT ARRAY[]::TEXT[],
  status schedule_status NOT NULL DEFAULT 'ON_TIME',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  schedule_id UUID REFERENCES schedules(id) ON DELETE RESTRICT,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'PAID',
  paid_at TIMESTAMPTZ,
  boarded BOOLEAN DEFAULT false,
  boarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Passengers Table
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  identity_number VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  gender VARCHAR(5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_schedules_route_date ON schedules(route_id, departure_date);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);

-- Enable Row Level Security (RLS)
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;

-- Allow public read for bus, routes, and schedules
CREATE POLICY "Public read buses" ON buses FOR SELECT USING (true);
CREATE POLICY "Public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Public read schedules" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public view bookings by code" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert passengers" ON passengers FOR INSERT WITH CHECK (true);

-- Initial seed data
INSERT INTO buses (code, name, plate_number, model, seat_capacity, bus_class, layout, facilities, image_url)
VALUES 
('TN-01', 'Nusantara Royal Suites 01', 'B 7890 TNA', 'Scania K410IB Opticruise', 22, 'ROYAL_SLEEPER', '1-1', ARRAY['Individual Capsule', 'Android AVOD TV', 'Starlink WiFi', 'Toilet', 'Makan Prasmanan'], 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'),
('TN-03', 'Nusantara Executive Grand 03', 'B 7452 TNA', 'Mercedes-Benz OH 1626L', 28, 'EXECUTIVE_PLUS', '1-2', ARRAY['Reclining Seat 1-2', 'Leg Rest', 'WiFi', 'Toilet', 'Snack Box'], 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80');

INSERT INTO routes (origin, destination, origin_terminal, destination_terminal, distance_km, estimated_hours, popular)
VALUES
('Jakarta', 'Yogyakarta', 'Terminal Pulo Gebang & Pool Pondok Pinang', 'Terminal Giwangan & Pool Jombor', 560, 7.5, true),
('Jakarta', 'Surabaya', 'Terminal Pulo Gebang & Pool Kalideres', 'Terminal Bungurasih (Purabaya)', 785, 9.5, true),
('Jakarta', 'Bandung', 'Pool CP Sudirman', 'Pool Pasteur Bandung', 155, 2.5, true);
