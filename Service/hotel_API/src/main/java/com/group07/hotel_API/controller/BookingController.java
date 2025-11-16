package com.group07.hotel_API.controller;


import com.group07.hotel_API.dto.request.Booking.BookingRequest;
import com.group07.hotel_API.dto.request.Booking.BookingUpdateRequest;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {


        private final BookingService bookingService;

        @Autowired
        public BookingController(BookingService bookingService) { this.bookingService = bookingService;
        }


        @PostMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
        public ResponseEntity<GeneralResponse> createBooking(@Valid @RequestBody BookingRequest request) {
            BookingResponse response = bookingService.save(request);
            return buildResponse("Booking created", HttpStatus.CREATED, response);
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
        public ResponseEntity<GeneralResponse> updateBooking(@PathVariable int id, @Valid @RequestBody BookingUpdateRequest request) {
            BookingResponse response = bookingService.update(id, request);
            return buildResponse("Booking updated", HttpStatus.OK, response);
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
        public ResponseEntity<GeneralResponse> deleteBooking(@PathVariable int id) {
            BookingResponse booking = bookingService.findById(id);
            bookingService.delete(id);
            return buildResponse("Booking deleted", HttpStatus.OK, booking);
        }
        @GetMapping("/me/{id}")
        @PreAuthorize("hasRole('USER')")
        public ResponseEntity<GeneralResponse> getMyBookings(@PathVariable int id) {
        var bookings = bookingService.getUserBookings(id);
        return buildResponse("Bookings loaded successfully", HttpStatus.OK, bookings);
    }
        @GetMapping("/active")
        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF', 'USER')")
        public ResponseEntity<GeneralResponse> getActiveBookings() {
        var bookings = bookingService.getActiveBookings();
        return buildResponse("Successfully retrieved active bookings", HttpStatus.OK, bookings);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping("/active/room/{roomId}")
    public ResponseEntity<GeneralResponse> getActiveBookingByRoomId(@PathVariable int roomId) {
        var bookings = bookingService.findActiveByRoomId(roomId);
        return buildResponse("Bookings loaded successfully", HttpStatus.OK, bookings);
    }

    @PostMapping("/checkIn/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GeneralResponse> checkIn(@PathVariable int userId) {
        BookingResponse response = bookingService.checkIn(userId);
        return buildResponse("Check-in successfully", HttpStatus.OK, response);
    }

    @PostMapping("/checkOut/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GeneralResponse> checkOut(@PathVariable int userId) {
        BookingResponse response = bookingService.checkOut(userId);
        return buildResponse("Check-out successfully", HttpStatus.OK, response);
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getAllBookings() {

        List<BookingResponse> bookings = bookingService.findAll();
        if (bookings.isEmpty()) {
            return buildResponse("No bookings found", HttpStatus.NOT_FOUND, null);
        }
        return buildResponse("Bookings found successfully", HttpStatus.OK, bookings);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE','USER')")
    public ResponseEntity<GeneralResponse> getBookingById(@PathVariable int id) {
        BookingResponse booking = bookingService.findById(id);
        return buildResponse("Booking found successfully", HttpStatus.OK, booking);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
            String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
            return ResponseEntity.status(status).body(GeneralResponse.builder()
                    .message(message)
                    .status(status.value())
                    .data(data)
                    .uri(uri)
                    .time(LocalDate.now())
                    .build());
        }
    }

