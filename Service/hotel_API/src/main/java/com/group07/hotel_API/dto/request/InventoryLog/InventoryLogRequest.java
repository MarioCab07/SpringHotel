package com.group07.hotel_API.dto.request.InventoryLog;

import com.group07.hotel_API.utils.enums.Action;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryLogRequest {
    @NotNull(message = "Item ID cannot be null")
    private Long itemId;
    @NotNull(message = "User ID cannot be null")
    private Long userId;
    @NotNull(message = "Action cannot be null")
    private Action action;
    @NotNull(message = "Quantity changed cannot be null")
    private int quantityChanged;
    @NotNull(message = "Timestamp cannot be null")
    private String timestamp;
}
