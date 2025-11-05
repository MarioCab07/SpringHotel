package com.group07.hotel_API.dto.response.Booking;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingResponse {

    private Integer id;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private Integer userId;
    private Integer roomId;
}
