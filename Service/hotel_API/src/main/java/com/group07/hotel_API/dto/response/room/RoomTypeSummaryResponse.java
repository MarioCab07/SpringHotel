package com.group07.hotel_API.dto.response.room;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomTypeSummaryResponse {
    private Integer typeId;
    private String name;
    private String description;
    private Double price;
    private Long availableRooms;
}
