package com.group07.hotel_API.dto.request.room_service_type;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomServiceTypeUpdateRequest {

    @NotNull(message = "You must provide a room service type ID")
    private Integer id;

    @NotNull(message = "You must provide a name for the room service type")
    private String name;

    @Positive(message = "Price must be positive")
    @NotNull(message = "You must provide a price for the room service type")
    private double price;
}
