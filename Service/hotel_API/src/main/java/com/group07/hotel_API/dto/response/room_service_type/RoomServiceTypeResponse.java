package com.group07.hotel_API.dto.response.room_service_type;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomServiceTypeResponse {
    private Integer id;
    private String name;
    private double price;
}
