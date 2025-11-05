package com.group07.hotel_API.dto.request.room_service_type;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomServiceTypeRequest {

    @NotNull(message = "Name cannot be null")
    private String name;

    @Positive(message = "Price must be positive")
    @NotNull(message = "Price cannot be null")
    private double price;
}
