package com.group07.hotel_API.utils.mappers;
import com.group07.hotel_API.dto.request.ItemCategory.ItemCategoryRequest;
import com.group07.hotel_API.dto.response.ItemCategory.ItemCategoryResponse;
import com.group07.hotel_API.entities.ItemCategory;

public class ItemCategoryMapper {
    public static ItemCategory toEntityCreate(ItemCategoryRequest request) {
        return ItemCategory.builder()
                .name(request.getName())
                .build();
    }

    public static ItemCategoryResponse toResponse(ItemCategory entity) {
        return ItemCategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .quantity(entity.getInventoryItems() != null ? entity.getInventoryItems().size() : 0)
                .build();
    }

    public static void toEntityUpdate(ItemCategory category, ItemCategoryRequest request) {
        category.setName(request.getName());
    }
}
