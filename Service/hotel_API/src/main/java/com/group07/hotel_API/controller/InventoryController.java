package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.Inventory.InventoryItemRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import com.group07.hotel_API.service.InventoryItemService;
import com.group07.hotel_API.service.RoomServiceService;
import com.group07.hotel_API.utils.enums.Status;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/inventory")
public class InventoryController {
    private final InventoryItemService inventoryService;

    @Autowired
    public InventoryController(InventoryItemService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<GeneralResponse> create(@RequestBody @Valid InventoryItemRequest request) {

        return buildResponse("Inventory item created successfully", HttpStatus.CREATED, inventoryService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAll() {
        return buildResponse("All inventory items retrieved successfully", HttpStatus.OK, inventoryService.getAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping("/grouped-by-category")
    public ResponseEntity<GeneralResponse> getGroupedByCategory() {
        return buildResponse("Inventory items grouped by category", HttpStatus.OK, inventoryService.getGroupedByCategory());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getById(@PathVariable Long id) {
        return buildResponse("Inventory item retrieved successfully", HttpStatus.OK, inventoryService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> update(@PathVariable Long id, @RequestBody @Valid InventoryItemRequest request) {

        return buildResponse("Inventory item updated successfully", HttpStatus.OK, inventoryService.update(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<GeneralResponse> updateItemQuantity(
            @PathVariable Long id,
            @RequestBody Integer quantity) {
        inventoryService.updateItemQuantity(id, quantity);
        return buildResponse("Cantidad actualizada", HttpStatus.OK, null);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<GeneralResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        inventoryService.updateStatus(id, status);
        return buildResponse("Estado del inventario actualizado", HttpStatus.OK, null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return buildResponse("Inventory item deleted successfully", HttpStatus.NO_CONTENT, null);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .time(LocalDate.now())
                .build());
    }
}

