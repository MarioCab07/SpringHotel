package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.response.InventoryLog.InventoryLogResponse;
import com.group07.hotel_API.entities.InventoryLog;

public class InventoryLogMapper {

    public static InventoryLogResponse toResponse(InventoryLog log) {
        return InventoryLogResponse.builder()
                .id(log.getId())
                .itemName(log.getItem().getName())
                .username(log.getUser().getUsername())
                .action(log.getAction())
                .quantityChanged(log.getQuantityChanged())
                .timestamp(log.getTimestamp())
                .build();
    }

}
