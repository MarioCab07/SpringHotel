package com.group07.hotel_API.dto.response.Inventory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryItemResponse {
    private Long id;
    private String name;
    private String type;
    private int quantity;
    private String status;
    private Long categoryId;
    private String categoryName;

}
