package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.room_service.RoomServiceRequest;
import com.group07.hotel_API.dto.request.room_service.RoomServiceUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room_service.RoomServiceResponse;
import com.group07.hotel_API.exception.room_service.RoomServiceNotFoundException;
import com.group07.hotel_API.service.RoomServiceService;
import com.group07.hotel_API.utils.enums.ServiceStatus;
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
@RequestMapping("api/room-services")
public class RoomServiceController {
    private final RoomServiceService roomServiceService;

    @Autowired
    public RoomServiceController(RoomServiceService roomServiceService) {
        this.roomServiceService = roomServiceService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAll() {
        List<RoomServiceResponse> roomServices = roomServiceService.findAll();

        if (roomServices.isEmpty()){
            throw new RoomServiceNotFoundException("No room services found");
        }

        return buildResponse("Room services found", HttpStatus.OK, roomServices);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'USER', 'CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getById(@PathVariable Integer id) {
        RoomServiceResponse roomService = roomServiceService.findById(id);

        return buildResponse("Room service found", HttpStatus.OK, roomService);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'USER')")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<GeneralResponse> getByBookingId(@PathVariable Integer bookingId) {
        List<RoomServiceResponse> roomServices = roomServiceService.findByBookingId(bookingId);

        if (roomServices.isEmpty()) {
            throw new RoomServiceNotFoundException("No room services found for booking ID: " + bookingId);
        }

        return buildResponse("Room services found for booking ID", HttpStatus.OK, roomServices);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    @GetMapping("/status/{status}")
    public ResponseEntity<GeneralResponse> getByStatus(@PathVariable ServiceStatus status) {
        List<RoomServiceResponse> roomServices = roomServiceService.findByStatus(status);

        if (roomServices.isEmpty()) {
            throw new RoomServiceNotFoundException("No room services found for status: " + status);
        }

        return buildResponse("Room services found for status", HttpStatus.OK, roomServices);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'USER')")
    @PostMapping
    public ResponseEntity<GeneralResponse> create(@RequestBody RoomServiceRequest request) {
        RoomServiceResponse createdRoomService = roomServiceService.save(request);

        return buildResponse("Room service created successfully", HttpStatus.CREATED, createdRoomService);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','CLEANING_STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> update(@PathVariable Integer id, @RequestBody RoomServiceUpdateRequest request) {
        RoomServiceResponse updatedRoomService = roomServiceService.update(id, request);

        return buildResponse("Room service updated successfully", HttpStatus.OK, updatedRoomService);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> delete(@PathVariable Integer id) {
        RoomServiceResponse roomService = roomServiceService.findById(id);
        roomServiceService.deleteById(id);
        return buildResponse("Room service deleted successfully", HttpStatus.OK, roomService);
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