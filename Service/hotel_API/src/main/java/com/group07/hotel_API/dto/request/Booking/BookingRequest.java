package com.group07.hotel_API.dto.request.Booking;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingRequest {

        @NotNull(message = "Check-in date is required")
        @FutureOrPresent(message = "Check-in date must be today or in the future")
        private LocalDate checkIn;

        @NotNull(message = "Check-out date is required")
        private LocalDate checkOut;

        @NotNull(message = "User ID is required")
        private Integer userId;

        @NotNull(message = "Room ID is required")
        private Integer roomId;

    }




