package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;
import com.group07.hotel_API.dto.response.room_type.RoomTypeResponse;
import com.group07.hotel_API.exception.room_type.RoomTypeNotFoundException;
import com.group07.hotel_API.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/room_type")
public class RoomTypeController {
    private final RoomTypeService roomTypeService;

    @Autowired
    public RoomTypeController(RoomTypeService roomTypeService) {
        this.roomTypeService = roomTypeService;
    }


    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    public ResponseEntity<GeneralResponse> getAllRoomTypes() {
        List<RoomTypeResponse> types = roomTypeService.findAll();
        if (types.isEmpty()) {
            throw new RoomTypeNotFoundException("No room types found");
        }
        return buildResponse("Room types retrieved successfully", HttpStatus.OK, types);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getRoomTypeById(@PathVariable Integer id) {
        RoomTypeResponse type = roomTypeService.findDtoById(id);
        return buildResponse("Room type found", HttpStatus.OK, type);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<GeneralResponse> create(@RequestBody RoomTypeRequest request){
        RoomTypeResponse roomType = roomTypeService.save(request);

        return buildResponse("Room service type created successfully", HttpStatus.CREATED, roomType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> update(@PathVariable Integer id, @RequestBody RoomTypeUpdateRequest request) {
        RoomTypeResponse roomType = roomTypeService.update(id, request);
        return buildResponse("Room type updated successfully", HttpStatus.OK, roomType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> delete(@PathVariable Integer id) {
        roomTypeService.delete(id);
        return buildResponse("Room type deleted successfully", HttpStatus.NO_CONTENT, null);
    }

    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        GeneralResponse response = GeneralResponse.builder()
                .uri(uri)
                .message(message)
                .status(status.value())
                .data(data)
                .build();
        return ResponseEntity.status(status).body(response);
    }

}
