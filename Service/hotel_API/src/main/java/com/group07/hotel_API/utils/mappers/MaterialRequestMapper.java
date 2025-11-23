package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.response.MaterialRequest.MaterialRequestItemResponse;
import com.group07.hotel_API.dto.response.MaterialRequest.MaterialRequestResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.MaterialRequest;
import com.group07.hotel_API.entities.MaterialRequestItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MaterialRequestMapper {

    public static MaterialRequestResponse toResponse(MaterialRequest request) {
        return MaterialRequestResponse.builder()
                .id(request.getId())
                .requestedById(request.getRequestedBy().getId())
                .requestedByUsername(request.getRequestedBy().getUsername())
                .requestedByName(request.getRequestedBy().getName())
                .requestDate(request.getRequestDate())
                .status(request.getStatus().name())
                .notes(request.getNotes())
                .items(request.getItems().stream()
                        .map(MaterialRequestMapper::toItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public static MaterialRequestItemResponse toItemResponse(MaterialRequestItem item) {
        InventoryItem inventoryItem = item.getItem();
        return MaterialRequestItemResponse.builder()
                .id(item.getId())
                .itemId(inventoryItem.getId())
                .itemName(inventoryItem.getName())
                .itemType(inventoryItem.getType())
                .requestedQuantity(item.getRequestedQuantity())
                .approvedQuantity(item.getApprovedQuantity())
                .availableStock(inventoryItem.getQuantity())
                .build();
    }
}


