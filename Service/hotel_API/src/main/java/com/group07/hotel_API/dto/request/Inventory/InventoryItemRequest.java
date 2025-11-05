package com.group07.hotel_API.dto.request.Inventory;


import com.group07.hotel_API.utils.enums.Status;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class InventoryItemRequest {

    @NotEmpty(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Type cannot be blank")
    private String type;

    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be a positive number")
    private int quantity;

    //@NotNull(message = "Status cannot be empty")
    private Status status;

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;
}
