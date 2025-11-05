package com.group07.hotel_API.dto.request.Booking;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingUpdateRequest {


        @NotNull(message = "You must provide a booking ID")
        private Integer bookingId;
        @Future(message = "Check-in date cannot be in the past")
        private LocalDate checkIn;
        @Future(message = "Check-out date cannot be in the past")
        private LocalDate checkOut;
        private String status;
        private Integer roomId;
        private Integer userId;

}