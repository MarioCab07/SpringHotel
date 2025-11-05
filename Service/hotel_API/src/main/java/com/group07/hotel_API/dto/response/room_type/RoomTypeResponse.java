package com.group07.hotel_API.dto.response.room_type;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomTypeResponse {
    private Integer roomTypeId;
    private String roomTypeName;
    private String description;
    private Double pricePerNight;
}
