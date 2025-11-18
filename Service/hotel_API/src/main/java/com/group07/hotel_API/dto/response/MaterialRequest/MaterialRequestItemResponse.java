package com.group07.hotel_API.dto.response.MaterialRequest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MaterialRequestItemResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private String itemType;
    private int requestedQuantity;
    private int approvedQuantity;
    private int availableStock;
}


