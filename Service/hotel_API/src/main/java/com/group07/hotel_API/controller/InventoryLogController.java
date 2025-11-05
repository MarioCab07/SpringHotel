package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.InventoryLog.InventoryLogRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.InventoryLog.InventoryLogResponse;
import com.group07.hotel_API.service.InventoryLogService;
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
@RequestMapping("/api/inventory/log")
public class InventoryLogController {

    private final InventoryLogService inventoryLogService;

    @Autowired
    public InventoryLogController(InventoryLogService inventoryLogService) {
        this.inventoryLogService = inventoryLogService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PostMapping
    public ResponseEntity<GeneralResponse> createLog(@RequestBody @Valid InventoryLogRequest request) {
        return buildResponse("Inventory log created successfully", HttpStatus.CREATED, inventoryLogService.createLog(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAllLogs() {
        return buildResponse("All inventory logs retrieved successfully", HttpStatus.OK, inventoryLogService.getAllLogs());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getLogById(@PathVariable Long id) {
        return buildResponse("Inventory log retrieved successfully", HttpStatus.OK, inventoryLogService.getLogById(id));
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
