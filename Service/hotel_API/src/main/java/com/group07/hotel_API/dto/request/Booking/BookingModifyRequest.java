package com.group07.hotel_API.dto.request.Booking;

import lombok.Data;

@Data
public class BookingModifyRequest {
    private String checkIn;
    private String checkOut;
}