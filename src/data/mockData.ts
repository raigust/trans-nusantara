import { Bus, Route, Schedule, Booking, FleetCategoryInfo } from '../types';

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'bus-1',
    code: 'TN-01',
    name: 'Nusantara Double Decker Dream Coach',
    plateNumber: 'AD 7001 TN',
    model: 'Scania K410IB 6x2 Opticruise - Jetbus 5 Super Double Decker (SDD)',
    chassis: 'Scania K410IB Opticruise 410 HP',
    karoseri: 'Adiputro Jetbus 5 SDD Voyager',
    seatCapacity: 28,
    busClass: 'First Class Sleeper',
    layout: '1-1',
    totalRows: 6,
    isDoubleDecker: true,
    status: 'in-trip',
    facilities: [
      'Pramugari & Pramugara Onboard',
      'First Class Sleeper Lay-Flat 180°',
      'Makan Prasmanan Resto Subang (Voucher Gratis)',
      'Free Flow Hot Coffee, Tea & Mineral Water',
      'Personal AVOD Android 14" + ANC Headset',
      'Starlink Satellite High-Speed WiFi',
      'Air Suspension Elektronik Standar Eropa',
      'Toilet & Bidet Mewah Bersih Onboard',
      'Bantal Bulu Angsa & Selimut Wol Tebal'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    currentLocation: 'Tol Cipali Km 164 (Majalengka)',
    speedKmH: 94,
    currentTollKm: 'Tol Cipali KM 164',
    nextRestArea: 'Rest Area KM 166 Subang (Makan Prasmanan)',
  },
  {
    id: 'bus-2',
    code: 'TN-02',
    name: 'Nusantara Suites Class Luxury Capsule',
    plateNumber: 'AD 7002 TN',
    model: 'Volvo B11R 430HP I-Shift - Legacy SR3 Suites Class',
    chassis: 'Volvo B11R 430 HP Euro 5',
    karoseri: 'Laksana Karoseri Legacy SR3',
    seatCapacity: 22,
    busClass: 'Royal Sleeper',
    layout: '1-1',
    totalRows: 11,
    isDoubleDecker: false,
    status: 'ready',
    facilities: [
      'Individual Capsule Bedroom with Sliding Curtain',
      'Zero Gravity Electric Recliner Seat',
      'Makan Malam Prasmanan Gratis',
      'Layar AVOD Android Hiburan Pribadi',
      'Starlink High-Speed WiFi 100 Mbps',
      'Fast Charger Type-C 45W + Steker AC',
      'Pramugari Ramah Siap Melayani',
      'Toilet Penumpang Higienis'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=85',
    currentLocation: 'Pool Pusat Cilandak Jakarta',
    speedKmH: 0,
    currentTollKm: 'Garasi Pusat Pool',
    nextRestArea: 'Pemberangkatan 19:30 WIB',
  },
  {
    id: 'bus-3',
    code: 'TN-03',
    name: 'Nusantara Super Top Double Decker 03',
    plateNumber: 'AD 7003 TN',
    model: 'Mercedes-Benz OC 500 RF 2542 - Avante D2 Tentrem',
    chassis: 'Mercedes-Benz OC 500 RF 2542 Air Suspension',
    karoseri: 'Tentrem Karoseri Avante D2',
    seatCapacity: 34,
    busClass: 'Super Top Double Decker',
    layout: '2-1',
    totalRows: 9,
    isDoubleDecker: true,
    status: 'in-trip',
    facilities: [
      'Konfigurasi Super Lapang 2-1 (Dek Atas & Bawah)',
      'Double Leg Rest + Foot Rest Ergonomis',
      'Servis Makan Prasmanan Rest Area',
      'Snack Box Premium & Kopi Gratis',
      'WiFi Onboard & USB Port Tiap Kursi',
      'Toilet Nyaman & Smoking Room Terpisah'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1600&q=85',
    currentLocation: 'Tol Batang - Semarang Km 382',
    speedKmH: 91,
    currentTollKm: 'Tol Batang KM 382',
    nextRestArea: 'Rest Area KM 391A Batang',
  },
  {
    id: 'bus-4',
    code: 'TN-04',
    name: 'Nusantara Executive Plus Grand 04',
    plateNumber: 'AD 7004 TN',
    model: 'Mercedes-Benz OH 1626L Air Suspension - Jetbus 5 MHD',
    chassis: 'Mercedes-Benz OH 1626L Built-in Air Suspension',
    karoseri: 'Adiputro Jetbus 5 MHD',
    seatCapacity: 28,
    busClass: 'Executive Plus',
    layout: '2-2',
    totalRows: 7,
    isDoubleDecker: false,
    status: 'ready',
    facilities: [
      'Reclining Ergonomic Seat Rimba Kencana',
      'Leg Rest Nyaman Tiap Kursi',
      'Voucher Makan Resto Gratis',
      'Port USB Fast Charging & WiFi',
      'Toilet Bersih Onboard',
      'Snack Box & Air Mineral 600ml'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    currentLocation: 'Pool Giwangan Yogyakarta',
    speedKmH: 0,
    currentTollKm: 'Terminal Giwangan',
    nextRestArea: 'Persiapan Keberangkatan',
  }
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-1',
    origin: 'Jakarta',
    destination: 'Yogyakarta',
    originTerminal: 'Terminal Pulo Gebang & Pool Cilandak',
    destinationTerminal: 'Terminal Giwangan & Pool Jombor',
    distanceKm: 560,
    estimatedHours: 7.5,
    popular: true,
    via: 'Full Tol Trans Jawa (Cipali - Palimanan - Bawen - Solo - Yogya)',
  },
  {
    id: 'route-2',
    origin: 'Jakarta',
    destination: 'Solo',
    originTerminal: 'Terminal Pulo Gebang & Pool Pasar Rebo',
    destinationTerminal: 'Terminal Tirtonadi & Pool Palur',
    distanceKm: 540,
    estimatedHours: 6.8,
    popular: true,
    via: 'Full Tol Trans Jawa (Exit Tol Kartasura)',
  },
  {
    id: 'route-3',
    origin: 'Jakarta',
    destination: 'Surabaya',
    originTerminal: 'Terminal Pulo Gebang & Pool Kalideres',
    destinationTerminal: 'Terminal Bungurasih (Purabaya) & Pool Medaeng',
    distanceKm: 785,
    estimatedHours: 9.5,
    popular: true,
    via: 'Non-Stop Tol Trans Jawa (Cipali - Semarang - Solo - Kertosono - Surabaya)',
  },
  {
    id: 'route-4',
    origin: 'Jakarta',
    destination: 'Malang',
    originTerminal: 'Terminal Pulo Gebang & Pondok Pinang',
    destinationTerminal: 'Terminal Arjosari & Pool Karanglo Malang',
    distanceKm: 850,
    estimatedHours: 10.5,
    popular: true,
    via: 'Tol Trans Jawa (Pandaan - Malang Express)',
  },
  {
    id: 'route-5',
    origin: 'Surabaya',
    destination: 'Denpasar (Bali)',
    originTerminal: 'Terminal Purabaya & Pool Medaeng Surabaya',
    destinationTerminal: 'Terminal Mengwi & Pool Ubung Denpasar',
    distanceKm: 420,
    estimatedHours: 10.0,
    popular: true,
    via: 'Tol Probowangi - Pelabuhan Ketapang/Gilimanuk Express Ferry',
  },
  {
    id: 'route-6',
    origin: 'Jakarta',
    destination: 'Purwokerto',
    originTerminal: 'Terminal Pulo Gebang & Pool Kampung Rambutan',
    destinationTerminal: 'Terminal Bulupitu Purwokerto',
    distanceKm: 375,
    estimatedHours: 5.5,
    popular: false,
    via: 'Tol Pejagan - Bumiayu - Purwokerto Line',
  }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-1',
    routeId: 'route-1',
    route: INITIAL_ROUTES[0],
    busId: 'bus-1',
    bus: INITIAL_BUSES[0],
    departureDate: '2026-10-18',
    departureTime: '07:30',
    arrivalTime: '15:00',
    basePrice: 510000,
    bookedSeats: ['1A', '2A', '3B', '5A'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  },
  {
    id: 'sch-2',
    routeId: 'route-1',
    route: INITIAL_ROUTES[0],
    busId: 'bus-2',
    bus: INITIAL_BUSES[1],
    departureDate: '2026-10-18',
    departureTime: '19:30',
    arrivalTime: '03:00',
    basePrice: 475000,
    bookedSeats: ['1A', '1B', '2A', '4A', '6B'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  },
  {
    id: 'sch-3',
    routeId: 'route-2',
    route: INITIAL_ROUTES[1],
    busId: 'bus-3',
    bus: INITIAL_BUSES[2],
    departureDate: '2026-10-18',
    departureTime: '08:30',
    arrivalTime: '15:15',
    basePrice: 380000,
    bookedSeats: ['1A', '2B', '3A'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  },
  {
    id: 'sch-4',
    routeId: 'route-3',
    route: INITIAL_ROUTES[2],
    busId: 'bus-1',
    bus: INITIAL_BUSES[0],
    departureDate: '2026-10-18',
    departureTime: '17:00',
    arrivalTime: '02:30',
    basePrice: 590000,
    bookedSeats: ['1A', '2A', '3A', '4A', '5B'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  },
  {
    id: 'sch-5',
    routeId: 'route-4',
    route: INITIAL_ROUTES[3],
    busId: 'bus-2',
    bus: INITIAL_BUSES[1],
    departureDate: '2026-10-18',
    departureTime: '16:30',
    arrivalTime: '03:00',
    basePrice: 530000,
    bookedSeats: ['2A', '2B'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  },
  {
    id: 'sch-6',
    routeId: 'route-5',
    route: INITIAL_ROUTES[4],
    busId: 'bus-3',
    bus: INITIAL_BUSES[2],
    departureDate: '2026-10-18',
    departureTime: '15:00',
    arrivalTime: '05:00',
    basePrice: 420000,
    bookedSeats: ['1A', '1B'],
    status: 'on-time',
    pramugariService: true,
    freeBuffetDinner: true,
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    bookingCode: 'TN-98241',
    scheduleId: 'sch-1',
    schedule: INITIAL_SCHEDULES[0],
    passengers: [
      {
        seatNumber: '1A',
        deck: 'lower',
        fullName: 'Budi Santoso',
        identityNumber: '3174092801900001',
        phone: '081289382910',
        gender: 'L',
      }
    ],
    contactName: 'Budi Santoso',
    contactEmail: 'budi.santoso@gmail.com',
    contactPhone: '081289382910',
    totalPrice: 510000,
    paymentMethod: 'QRIS',
    paymentStatus: 'paid',
    paidAt: '2026-10-16 14:20:12',
    createdAt: '2026-10-16 14:15:00',
    boarded: true,
    boardedAt: '2026-10-17 07:15:00'
  },
  {
    id: 'book-2',
    bookingCode: 'TN-84192',
    scheduleId: 'sch-4',
    schedule: INITIAL_SCHEDULES[3],
    passengers: [
      {
        seatNumber: '2A',
        deck: 'lower',
        fullName: 'Siti Rahmawati',
        identityNumber: '3273014810950002',
        phone: '085712903847',
        gender: 'P',
      }
    ],
    contactName: 'Siti Rahmawati',
    contactEmail: 'siti.rahma@yahoo.com',
    contactPhone: '085712903847',
    totalPrice: 590000,
    paymentMethod: 'BCA_VA',
    paymentStatus: 'paid',
    paidAt: '2026-10-16 16:45:00',
    createdAt: '2026-10-16 16:30:00',
    boarded: false
  }
];

export const FLEET_CATEGORIES: FleetCategoryInfo[] = [
  {
    name: 'First Class Sleeper',
    subtitle: 'Kapsul Hotel Berbintang Melaju di Jalan Tol',
    tagline: 'Tidur rebah 180° lay-flat dengan privasi personal, AVOD 14", & Starlink WiFi',
    description: 'Armada flagship Double Decker Jetbus 5 & Legacy SR3. Dek bawah khusus kabin kapsul tidur lay-flat 180° dengan pintu/tirai privasi, headrest memory foam, lampu baca, dan layanan pramugari ramah sepanjang perjalanan.',
    chassisInfo: 'Chassis Scania K410IB 6x2 Opticruise • 410 Horsepower • Full Air Suspension',
    priceStart: 510000,
    features: [
      'Kasur Rebah Penuh 180° (Zero Gravity)',
      'Layanan Pramugari & Pramugara Onboard',
      'Makan Prasmanan Resto Subang (Voucher Gratis)',
      'Layar Sentuh Android AVOD 14" Pribadi',
      'Koneksi Internet Starlink Satellite WiFi Bebas Batas',
      'Air Purifier HEPA Filter & Suasana Kabin Hening'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=85'
  },
  {
    name: 'Super Top Double Decker',
    subtitle: 'Kemewahan Dek Atas Panorama dengan Leg Rest Ganda',
    tagline: 'Konfigurasi 2-1 ekstra lega dengan pemandangan jalan tol dari lantai atas',
    description: 'Pilihan favorit eksekutif yang menginginkan kenyamanan duduk luas tanpa senggolan. Dilengkapi double electric leg rest, jok kulit ergonomis Rimba Kencana, dan panorama indah dari dek atas bus double-decker.',
    chassisInfo: 'Chassis Mercedes-Benz OC 500 RF 2542 • 420 Horsepower • EBS & ESP',
    priceStart: 380000,
    features: [
      'Konfigurasi Kursi 2-1 Super Luas',
      'Double Leg Rest + Foot Rest Ergonomis',
      'Gratis Makan Prasmanan di Rest Area Resmi',
      'Free Flow Hot Coffee, Tea & Dispenser Mineral',
      'Toilet Bersih & Smoking Room Terpisah',
      'Bagasi Luas untuk Koper Besar'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1600&q=85',
    interiorImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85'
  },
  {
    name: 'Executive Plus',
    subtitle: 'Standar Kenyamanan Antar-Kota Terbaik Trans Jawa',
    tagline: 'Keberangkatan on-time 99.8% dengan suspensi udara lembut Mercedes-Benz',
    description: 'Solusi perjalanan cepat, tepat waktu, dan ekonomis melintasi jalur Jakarta - Yogyakarta - Surabaya. Suspensi udara halus meredam getaran jalan, kursi reclining empuk, dan kru profesional berpengalaman puluhan tahun.',
    chassisInfo: 'Mercedes-Benz OH 1626L Built-in Air Suspension • Euro 5 Ramah Lingkungan',
    priceStart: 295000,
    features: [
      'Kursi Reclining 135° dengan Leg Rest',
      'Port USB Fast Charger di Setiap Kursi',
      'Voucher Makan Prasmanan Gratis',
      'AC Dingin Merata dengan Ion Negatif',
      'WiFi Onboard Selama Perjalanan',
      'Driver Lisensi Khusus Lulus Uji Standar'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=85',
    interiorImageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1600&q=85'
  }
];

export const INDONESIAN_PO_SERVICES = [
  {
    title: 'Layanan Pramugari Onboard',
    desc: 'Layanan keramahan bak penerbangan: penyajian snack, selimut bersih, bantal, hingga bantuan check-in bagasi.',
    icon: 'Sparkles',
    badge: 'First Class Experience'
  },
  {
    title: 'Makan Prasmanan Resto Subang & Solo',
    desc: 'Semua tiket sudah termasuk voucher makan prasmanan gratis di restoran resmi ber-AC dengan menu lezat khas Nusantara.',
    icon: 'Utensils',
    badge: 'Termasuk di Tiket'
  },
  {
    title: 'Live GPS Tol Trans Jawa',
    desc: 'Pantau posisi armada, kecepatan bus secara real-time, dan estimasi waktu tiba (ETA) langsung di smartphone Anda.',
    icon: 'Navigation',
    badge: 'Akurat Real-time'
  },
  {
    title: 'Ketepatan Waktu 99.8%',
    desc: 'Jalur non-stop via Tol Trans Jawa tanpa ngetem sembarangan dengan pemantauan kecepatan batas aman.',
    icon: 'Clock',
    badge: 'On-Time Guarantee'
  }
];

export const NEWS_AND_EVENTS = [
  {
    id: 'n1',
    title: 'Peresmian Armada Baru: 15 Unit Scania K410IB Jetbus 5 Super Double Decker Siap Beroperasi',
    excerpt: 'TransNusantara memperkuat rute Jakarta - Surabaya - Malang dengan armada Double Decker termutakhir berfasilitas Sleeper Suites dan AVOD Starlink.',
    date: '16 Oktober 2026',
    category: 'Armada Baru',
    readTime: '3 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'n2',
    title: 'Jelajah Wisata Jogja & Solo Lebih Nyaman dengan Tiket Pulang-Pergi Diskon 15%',
    excerpt: 'Manfaatkan kemudahan reservasi tiket jauh-jauh hari untuk liburan akhir pekan panjang bersama keluarga tercinta.',
    date: '12 Oktober 2026',
    category: 'Promo Spesial',
    readTime: '2 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'n3',
    title: 'TransNusantara Express Raih Penghargaan Pelayanan Transportasi Darat Bintang 5',
    excerpt: 'Penghargaan bergengsi dari Kementerian Perhubungan RI atas dedikasi ketepatan waktu keberangkatan dan kepuasan penumpang tertinggi.',
    date: '05 Oktober 2026',
    category: 'Prestasi & Legalitas',
    readTime: '4 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Dimas Wicaksono',
    role: 'Pelanggan Rute Jakarta - Surabaya (First Class Sleeper)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'First Class Sleeper TransNusantara beneran penyelamat perjalanan dinas. Naik jam 5 sore dari Pulo Gebang, bisa tidur nyenyak lay-flat sambil ngecas laptop, makan prasmanan di Resto Subang mantap banget, tiba di Surabaya segar bugar!',
    rating: 5,
    date: 'Kemarin'
  },
  {
    name: 'Anindya Putri',
    role: 'Traveler Wisata (Rute Jakarta - Yogyakarta)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: 'Pemesanan di web super praktis dan mewah, denah kursinya bisa pilih dek bawah atau dek atas. Drivernya sangat profesional dan tidak ugal-ugalan. Toilet di bus juga bersih banget!',
    rating: 5,
    date: '3 hari yang lalu'
  },
  {
    name: 'Hendro Kusumo',
    role: 'Keluarga Traveler (Rute Jakarta - Solo)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'Fasilitas Double Decker sangat sebanding dengan harganya. Anak-anak senang ada AVOD dan wifi cepat, makanan prasmanan di rest area juga lezat dan gratis.',
    rating: 5,
    date: '1 minggu yang lalu'
  }
];
