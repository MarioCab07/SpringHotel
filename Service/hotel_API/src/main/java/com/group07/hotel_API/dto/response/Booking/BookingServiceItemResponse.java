package com.group07.hotel_API.dto.response.Booking;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingServiceItemResponse {
    private Integer serviceId;
    private String serviceName;
    private Double price;
}
