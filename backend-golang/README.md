# 🚍 TransNusantara Fullstack Bus Ticketing Architecture

Arsitektur aplikasi terbagi menjadi 2 bagian yang sangat terorganisir:
1. **Frontend**: React + Vite + Tailwind CSS + Lucide Icons (siap deploy di Vercel).
2. **Backend**: Golang REST API dengan Gin & Prisma Client Go / Supabase PostgreSQL.
3. **Database**: Supabase PostgreSQL dengan Schema & Migrations siap pakai.

---

## 📁 Struktur Folder Project

```
├── src/                          # Frontend React + TypeScript (Vite / Next.js compatible)
│   ├── components/
│   │   ├── admin/                # Admin Panel: Armada, Jadwal, Penjualan, Scanner Check-In
│   │   ├── booking/              # Tiket: Rute Finder, Seat Map Interaktif, Checkout, E-Ticket
│   │   ├── home/                 # Company Profile: Hero (CP Express vibe), Fleet, Testimoni, Berita
│   │   └── layout/               # Navbar dengan Role Switcher, Footer, Drawer
│   ├── data/                     # Initial seed & mock data
│   ├── services/                 # Abstraksi Storage & API Client (LocalStorage / Supabase / Golang API)
│   └── types/                    # Tipe data TypeScript lengkap
│
├── backend-golang/               # Backend Go (Golang)
│   ├── cmd/
│   │   └── api/main.go           # Entry point API server Gin (Port 8080)
│   ├── internal/
│   │   └── models/               # Struct Golang (Bus, Route, Schedule, Booking, Passenger)
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema untuk PostgreSQL / Supabase
│   ├── go.mod & go.sum
│   └── README.md
│
├── supabase/
│   └── migrations/
│       └── 20261017_init_bus_ticketing.sql  # SQL Script siap copy-paste di Supabase SQL Editor
│
└── vercel.json                   # Konfigurasi deploy frontend di Vercel
```

---

## 🚀 Panduan Setup & Deploy

### 1. Setup Database di Supabase
1. Buka [database.new](https://database.new) dan buat project Supabase baru.
2. Buka menu **SQL Editor**, buka file `supabase/migrations/20261017_init_bus_ticketing.sql`, lalu klik **Run**.
3. Seluruh tabel (`buses`, `routes`, `schedules`, `bookings`, `passengers`) dan initial data otomatis terbuat!
4. Salin **Connection String URI** dari menu *Project Settings > Database*.

### 2. Menjalankan Backend Golang
```bash
cd backend-golang
go mod tidy

# Jalankan server
go run cmd/api/main.go
```
API akan menyala di `http://localhost:8080/api`.

### 3. Deploy Frontend ke Vercel
1. Push repository ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) -> **Add New Project**.
3. Pilih repository ini, biarkan framework preset **Vite**.
4. Set Environtment Variables jika ingin menghubungkan ke backend live:
   `VITE_API_URL=https://your-golang-api.up.railway.app/api`
5. Klik **Deploy**!
