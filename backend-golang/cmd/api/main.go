package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/transnusantara/bus-backend/internal/models"
)

// In-Memory Database store with Supabase sync support
type Store struct {
	mu        sync.RWMutex
	Buses     []models.Bus
	Routes    []models.Route
	Schedules []models.Schedule
	Bookings  []models.Booking
}

var dbStore = &Store{}

func initSeedData() {
	dbStore.Buses = []models.Bus{
		{
			ID: "bus-1", Code: "TN-01", Name: "Nusantara Royal Suites 01", PlateNumber: "B 7890 TNA",
			Model: "Scania K410IB Opticruise - Jetbus 5 Dream Coach", SeatCapacity: 22, BusClass: "Royal Sleeper",
			Layout: "1-1", TotalRows: 11, Status: "ready",
			Facilities: []string{"Capsule Bed", "Personal AVOD", "Starlink WiFi", "Toilet", "Makan Prasmanan"},
			ImageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
		},
		{
			ID: "bus-3", Code: "TN-03", Name: "Nusantara Executive Grand 03", PlateNumber: "B 7452 TNA",
			Model: "Mercedes-Benz OH 1626L Air Suspension", SeatCapacity: 28, BusClass: "Executive Plus",
			Layout: "1-2", TotalRows: 10, Status: "ready",
			Facilities: []string{"Reclining Seat 1-2", "Leg Rest Ganda", "WiFi", "Toilet", "Snack Box"},
			ImageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
		},
	}

	dbStore.Routes = []models.Route{
		{
			ID: "route-1", Origin: "Jakarta", Destination: "Yogyakarta",
			OriginTerminal: "Terminal Pulo Gebang & Pool Pondok Pinang", DestinationTerminal: "Terminal Giwangan",
			DistanceKm: 560, EstimatedHours: 7.5, Popular: true,
		},
		{
			ID: "route-2", Origin: "Jakarta", Destination: "Surabaya",
			OriginTerminal: "Terminal Pulo Gebang & Pool Kalideres", DestinationTerminal: "Terminal Bungurasih",
			DistanceKm: 785, EstimatedHours: 9.5, Popular: true,
		},
	}

	dbStore.Schedules = []models.Schedule{
		{
			ID: "sch-1", RouteID: "route-1", Route: dbStore.Routes[0],
			BusID: "bus-1", Bus: dbStore.Buses[0],
			DepartureDate: "2026-10-18", DepartureTime: "07:30", ArrivalTime: "15:00",
			BasePrice: 485000, BookedSeats: []string{"1A", "2A"}, Status: "on-time",
		},
		{
			ID: "sch-2", RouteID: "route-1", Route: dbStore.Routes[0],
			BusID: "bus-3", Bus: dbStore.Buses[1],
			DepartureDate: "2026-10-18", DepartureTime: "19:00", ArrivalTime: "02:30",
			BasePrice: 295000, BookedSeats: []string{"1A", "3B"}, Status: "on-time",
		},
	}

	dbStore.Bookings = []models.Booking{
		{
			ID: "book-1", BookingCode: "TN-98241", ScheduleID: "sch-1", Schedule: dbStore.Schedules[0],
			Passengers: []models.Passenger{
				{SeatNumber: "1A", FullName: "Budi Santoso", IdentityNumber: "3174092801900001", Phone: "081289382910", Gender: "L"},
			},
			ContactName: "Budi Santoso", ContactEmail: "budi.santoso@example.com", ContactPhone: "081289382910",
			TotalPrice: 485000, PaymentMethod: "QRIS", PaymentStatus: "paid",
			PaidAt: "2026-10-16 14:20:12", CreatedAt: "2026-10-16 14:15:00", Boarded: false,
		},
	}
}

func main() {
	initSeedData()

	r := gin.Default()

	// CORS Setup for frontend connection (Vite / Next.js / Vercel)
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "TransNusantara Bus API (Golang + Prisma/Supabase ready)",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	api := r.Group("/api")
	{
		// Buses
		api.GET("/buses", func(c *gin.Context) {
			dbStore.mu.RLock()
			defer dbStore.mu.RUnlock()
			c.JSON(http.StatusOK, dbStore.Buses)
		})

		// Routes
		api.GET("/routes", func(c *gin.Context) {
			dbStore.mu.RLock()
			defer dbStore.mu.RUnlock()
			c.JSON(http.StatusOK, dbStore.Routes)
		})

		// Schedules & Search
		api.GET("/schedules", func(c *gin.Context) {
			origin := c.Query("origin")
			destination := c.Query("destination")
			busClass := c.Query("busClass")

			dbStore.mu.RLock()
			defer dbStore.mu.RUnlock()

			var filtered []models.Schedule
			for _, sch := range dbStore.Schedules {
				if origin != "" && origin != "Semua" && !strings.EqualFold(sch.Route.Origin, origin) {
					continue
				}
				if destination != "" && destination != "Semua" && !strings.EqualFold(sch.Route.Destination, destination) {
					continue
				}
				if busClass != "" && busClass != "Semua" && !strings.EqualFold(sch.Bus.BusClass, busClass) {
					continue
				}
				filtered = append(filtered, sch)
			}
			c.JSON(http.StatusOK, filtered)
		})

		// Bookings
		api.GET("/bookings", func(c *gin.Context) {
			dbStore.mu.RLock()
			defer dbStore.mu.RUnlock()
			c.JSON(http.StatusOK, dbStore.Bookings)
		})

		// Get Booking by Code (for E-Ticket / Tracker)
		api.GET("/bookings/:code", func(c *gin.Context) {
			code := strings.ToUpper(strings.TrimSpace(c.Param("code")))
			dbStore.mu.RLock()
			defer dbStore.mu.RUnlock()

			for _, b := range dbStore.Bookings {
				if strings.ToUpper(b.BookingCode) == code {
					c.JSON(http.StatusOK, b)
					return
				}
			}
			c.JSON(http.StatusNotFound, gin.H{"error": "Tiket tidak ditemukan"})
		})

		// Create Booking
		api.POST("/bookings", func(c *gin.Context) {
			var req models.CreateBookingRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			dbStore.mu.Lock()
			defer dbStore.mu.Unlock()

			// Find Schedule
			var targetSchedule *models.Schedule
			for i := range dbStore.Schedules {
				if dbStore.Schedules[i].ID == req.ScheduleID {
					targetSchedule = &dbStore.Schedules[i]
					break
				}
			}
			if targetSchedule == nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Jadwal bus tidak ditemukan"})
				return
			}

			// Add seats to schedule
			for _, p := range req.Passengers {
				targetSchedule.BookedSeats = append(targetSchedule.BookedSeats, p.SeatNumber)
			}

			// Generate Booking
			bookingCode := fmt.Sprintf("TN-%d", 10000+rand.Intn(90000))
			newBooking := models.Booking{
				ID:            uuid.New().String(),
				BookingCode:   bookingCode,
				ScheduleID:    targetSchedule.ID,
				Schedule:      *targetSchedule,
				Passengers:    req.Passengers,
				ContactName:   req.ContactName,
				ContactEmail:  req.ContactEmail,
				ContactPhone:  req.ContactPhone,
				TotalPrice:    targetSchedule.BasePrice * float64(len(req.Passengers)),
				PaymentMethod: req.PaymentMethod,
				PaymentStatus: "paid",
				PaidAt:        time.Now().Format("2006-01-02 15:04:05"),
				CreatedAt:     time.Now().Format("2006-01-02 15:04:05"),
				Boarded:       false,
			}

			dbStore.Bookings = append([]models.Booking{newBooking}, dbStore.Bookings...)
			c.JSON(http.StatusCreated, newBooking)
		})

		// Passenger Check-In / Ticket Validation (for Admin Scanner)
		api.POST("/bookings/check-in", func(c *gin.Context) {
			var payload struct {
				BookingCode string `json:"bookingCode"`
			}
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			code := strings.ToUpper(strings.TrimSpace(payload.BookingCode))
			dbStore.mu.Lock()
			defer dbStore.mu.Unlock()

			for i := range dbStore.Bookings {
				if strings.ToUpper(dbStore.Bookings[i].BookingCode) == code {
					if dbStore.Bookings[i].Boarded {
						c.JSON(http.StatusBadRequest, gin.H{
							"success": false,
							"message": fmt.Sprintf("Tiket %s sudah di-check-in sebelumnya pada %s", code, dbStore.Bookings[i].BoardedAt),
						})
						return
					}
					dbStore.Bookings[i].Boarded = true
					dbStore.Bookings[i].BoardedAt = time.Now().Format("2006-01-02 15:04:05")
					c.JSON(http.StatusOK, gin.H{
						"success": true,
						"message": fmt.Sprintf("Penumpang %s berhasil check-in", dbStore.Bookings[i].ContactName),
						"booking": dbStore.Bookings[i],
					})
					return
				}
			}

			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Kode booking tidak valid"})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚍 TransNusantara Golang API running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
