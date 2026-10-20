package models

import "time"

type Bus struct {
	ID           string    `json:"id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	PlateNumber  string    `json:"plateNumber"`
	Model        string    `json:"model"`
	SeatCapacity int       `json:"seatCapacity"`
	BusClass     string    `json:"busClass"`
	Layout       string    `json:"layout"`
	TotalRows    int       `json:"totalRows"`
	Status       string    `json:"status"`
	Facilities   []string  `json:"facilities"`
	ImageUrl     string    `json:"imageUrl"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Route struct {
	ID                  string  `json:"id"`
	Origin              string  `json:"origin"`
	Destination         string  `json:"destination"`
	OriginTerminal      string  `json:"originTerminal"`
	DestinationTerminal string  `json:"destinationTerminal"`
	DistanceKm          float64 `json:"distanceKm"`
	EstimatedHours      float64 `json:"estimatedHours"`
	Popular             bool    `json:"popular"`
}

type Schedule struct {
	ID            string    `json:"id"`
	RouteID       string    `json:"routeId"`
	Route         Route     `json:"route"`
	BusID         string    `json:"busId"`
	Bus           Bus       `json:"bus"`
	DepartureDate string    `json:"departureDate"`
	DepartureTime string    `json:"departureTime"`
	ArrivalTime   string    `json:"arrivalTime"`
	BasePrice     float64   `json:"basePrice"`
	BookedSeats   []string  `json:"bookedSeats"`
	Status        string    `json:"status"`
}

type Passenger struct {
	SeatNumber     string `json:"seatNumber"`
	FullName       string `json:"fullName"`
	IdentityNumber string `json:"identityNumber"`
	Phone          string `json:"phone"`
	Gender         string `json:"gender"`
}

type Booking struct {
	ID            string      `json:"id"`
	BookingCode   string      `json:"bookingCode"`
	ScheduleID    string      `json:"scheduleId"`
	Schedule      Schedule    `json:"schedule"`
	Passengers    []Passenger `json:"passengers"`
	ContactName   string      `json:"contactName"`
	ContactEmail  string      `json:"contactEmail"`
	ContactPhone  string      `json:"contactPhone"`
	TotalPrice    float64     `json:"totalPrice"`
	PaymentMethod string      `json:"paymentMethod"`
	PaymentStatus string      `json:"paymentStatus"`
	PaidAt        string      `json:"paidAt,omitempty"`
	CreatedAt     string      `json:"createdAt"`
	Boarded       bool        `json:"boarded"`
	BoardedAt     string      `json:"boardedAt,omitempty"`
}

type CreateBookingRequest struct {
	ScheduleID    string      `json:"scheduleId" binding:"required"`
	Passengers    []Passenger `json:"passengers" binding:"required"`
	ContactName   string      `json:"contactName" binding:"required"`
	ContactEmail  string      `json:"contactEmail" binding:"required"`
	ContactPhone  string      `json:"contactPhone" binding:"required"`
	PaymentMethod string      `json:"paymentMethod" binding:"required"`
}
