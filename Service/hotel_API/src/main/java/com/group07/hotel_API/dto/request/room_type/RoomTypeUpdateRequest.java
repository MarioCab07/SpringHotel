package com.group07.hotel_API.dto.request.room_type;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomTypeUpdateRequest {
    @NotNull(message = "Room Type ID cannot be null")
    private Integer roomTypeId;
    @NotNull(message = "Room Type Name cannot be null")
    private String roomTypeName;
    @NotNull(message = "Description cannot be null")
    private String description;
    @NotNull(message = "Price per night cannot be null")
    private Double pricePerNight;
}
