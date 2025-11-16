package com.group07.hotel_API.dto.response.Booking;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
public class BookingDetailsResponse {
    private Integer id;
    private String status;
    private LocalDate checkIn;
    private LocalDate checkOut;

    private Integer roomId;
    private String roomNumber;
    private String roomType;
    private Double roomPrice;

    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}

