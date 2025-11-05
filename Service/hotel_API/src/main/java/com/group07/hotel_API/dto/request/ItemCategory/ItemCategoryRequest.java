package com.group07.hotel_API.dto.request.ItemCategory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;
}
