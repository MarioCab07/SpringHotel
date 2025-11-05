package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.Inventory.InventoryItemRequest;
import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.ItemCategory;
import com.group07.hotel_API.exception.Inventory.InventoryItemException;
import com.group07.hotel_API.exception.InventoryLog.ResourceNotFoundException;
import com.group07.hotel_API.repository.InventoryItemRepository;
import com.group07.hotel_API.repository.ItemCategoryRepository;
import com.group07.hotel_API.service.InventoryItemService;
import com.group07.hotel_API.utils.enums.Status;
import com.group07.hotel_API.utils.mappers.InventoryItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryItemServiceImpl implements InventoryItemService {

    private final InventoryItemRepository repository;
    private final ItemCategoryRepository categoryRepository;


    @Override
    public InventoryItemResponse create(InventoryItemRequest request) {

        ItemCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        InventoryItem item = InventoryItemMapper.toEntity(request);
        item.setCategory(category);
        return InventoryItemMapper.toResponse(repository.save(item));
    }

    @Override
    public Map<String, List<InventoryItemResponse>> getGroupedByCategory() {
        List<InventoryItem> items = repository.findAll();

        return items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getCategory() != null ? item.getCategory().getName() : "Sin categoría",
                        Collectors.mapping(InventoryItemMapper::toResponse, Collectors.toList())
                ));
    }


    @Override
    public List<InventoryItemResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(InventoryItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryItemResponse getById(Long id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));
        return InventoryItemMapper.toResponse(item);
    }

    @Override
    public InventoryItemResponse update(Long id, InventoryItemRequest request) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));

        item.setName(request.getName());
        item.setQuantity(request.getQuantity());

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        return InventoryItemMapper.toResponse(repository.save(item));
    }

    @Override
    public void updateItemQuantity(Long id, Integer quantity) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado con id: " + id));
        item.setQuantity(quantity);
        repository.save(item);
    }

    @Override
    public void updateStatus(Long id, Status status) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        item.setStatus(status);
        repository.save(item);
    }

    @Override
    public void delete(Long id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));
        repository.delete(item);
    }


}
