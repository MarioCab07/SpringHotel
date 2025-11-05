package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.Inventory.InventoryItemRequest;
import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import com.group07.hotel_API.utils.enums.Status;

import java.util.List;
import java.util.Map;

public interface InventoryItemService {
    InventoryItemResponse create(InventoryItemRequest request);
    List<InventoryItemResponse> getAll();
    Map<String, List<InventoryItemResponse>> getGroupedByCategory();
    InventoryItemResponse getById(Long id);
    InventoryItemResponse update(Long id, InventoryItemRequest request);
    void updateItemQuantity(Long id, Integer quantity);
    void updateStatus(Long id, Status status);
    void delete(Long id);

}