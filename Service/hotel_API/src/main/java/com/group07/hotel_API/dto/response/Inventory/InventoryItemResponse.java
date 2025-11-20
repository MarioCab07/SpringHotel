package com.group07.hotel_API.dto.response.Inventory;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemResponse {
    private Long id;
    private String name;
    private String type;
    private int quantity;
    private int minimumStock;
    @JsonProperty("isLowStock")
    private boolean isLowStock;
    private String status;
    private Long categoryId;
    private String categoryName;

}
