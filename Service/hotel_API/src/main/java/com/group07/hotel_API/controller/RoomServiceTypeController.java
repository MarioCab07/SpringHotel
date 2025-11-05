package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;
import com.group07.hotel_API.exception.room_service_type.RoomServiceTypeNotFoundException;
import com.group07.hotel_API.service.RoomServiceTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/room-service-types")
public class RoomServiceTypeController {
    private final RoomServiceTypeService roomServiceTypeService;

    @Autowired
    public RoomServiceTypeController(RoomServiceTypeService roomServiceTypeService) {
        this.roomServiceTypeService = roomServiceTypeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF', 'USER')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAll(){
        List<RoomServiceTypeResponse> roomServiceTypes = roomServiceTypeService.findAll();

        if (roomServiceTypes.isEmpty()) {
            throw new RoomServiceTypeNotFoundException("No room service types found");
        }

        return buildResponse("Room service types found successfully", HttpStatus.OK, roomServiceTypes);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getById(@PathVariable Integer id){
        RoomServiceTypeResponse roomServiceType = roomServiceTypeService.findById(id);

        return buildResponse("Room service type found successfully", HttpStatus.OK, roomServiceType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<GeneralResponse> create(@RequestBody @Valid RoomServiceTypeRequest request){
        RoomServiceTypeResponse roomServiceType = roomServiceTypeService.save(request);

        return buildResponse("Room service type created successfully", HttpStatus.CREATED, roomServiceType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> update(@PathVariable Integer id, @RequestBody @Valid RoomServiceTypeUpdateRequest request){
        RoomServiceTypeResponse roomServiceType = roomServiceTypeService.update(id, request);

        return buildResponse("Room service type updated successfully", HttpStatus.OK, roomServiceType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> delete(@PathVariable Integer id) {
        RoomServiceTypeResponse roomServiceType = roomServiceTypeService.findById(id);
        roomServiceTypeService.delete(id);
        return buildResponse("Room service type deleted successfully", HttpStatus.OK, roomServiceType);
    }

    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
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
