package com.group07.hotel_API.dto.request.MaterialRequest;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class MaterialRequestItemRequest {
    @NotNull(message = "Item ID cannot be null")
    private Long itemId;

    @NotNull(message = "Requested quantity cannot be null")
    @Positive(message = "Requested quantity must be positive")
    private int requestedQuantity;
}


