package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.Inventory.InventoryItemRequest;
import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.ItemCategory;
import com.group07.hotel_API.utils.enums.Status;
import org.springframework.stereotype.Component;

@Component
public class InventoryItemMapper {

    public static InventoryItem toEntity(InventoryItemRequest request) {
        ItemCategory category = ItemCategory.builder()
                .id(request.getCategoryId())
                .build();

        String statusStr = (request.getStatus() != null)
                ? request.getStatus().name()
                : "ACTIVE";

        return InventoryItem.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .type(request.getType())
                .category(category)
                .status(Status.valueOf(statusStr))
                .build();
    }

    public static InventoryItemResponse toResponse(InventoryItem item) {
        return InventoryItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .type(item.getType())
                .quantity(item.getQuantity())
                .status(item.getStatus().name()) // status real
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .build();
    }
}
