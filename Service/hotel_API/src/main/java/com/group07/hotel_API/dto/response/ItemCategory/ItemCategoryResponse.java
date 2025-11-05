package com.group07.hotel_API.dto.response.ItemCategory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemCategoryResponse {
    private Long id;
    private String name;
    private Integer quantity;
}
