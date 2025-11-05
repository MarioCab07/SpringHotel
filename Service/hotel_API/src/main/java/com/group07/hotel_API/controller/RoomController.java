package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.room.RoomRequest;
import com.group07.hotel_API.dto.request.room.RoomUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.service.RoomService;
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
@RequestMapping("/api/room")
public class RoomController {
    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF' , 'USER')")
    @GetMapping()
    public ResponseEntity<GeneralResponse> getAllRooms(){
        List<RoomResponse> room = roomService.findAll();

        if (room.isEmpty()){
            throw new RoomNotFoundException("Rooms were not found");
        }
        return buildResponse( "Rooms were found successfully", HttpStatus.OK, room);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF' , 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getRoomById(@PathVariable Integer id) {
        RoomResponse room = roomService.findById(id);
        return buildResponse("Room found successfully", HttpStatus.OK, room);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    @GetMapping("/status/{status}")
    public ResponseEntity<GeneralResponse> getRoomsByStatus(@PathVariable String status) {
        List<RoomResponse> rooms = roomService.findByStatus(status);
        if (rooms.isEmpty()) {
            throw new RoomNotFoundException("No rooms found with status: " + status);
        }
        return buildResponse("Rooms found successfully", HttpStatus.OK, rooms);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    @GetMapping("/available")
    public ResponseEntity<GeneralResponse> getAvailableRooms() {
        List<RoomResponse> rooms = roomService.getAvailableRooms();

        return buildResponse("Available rooms found successfully", HttpStatus.OK, rooms);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF')")
    @GetMapping("/type/{typeId}")
    public ResponseEntity<GeneralResponse> getRoomsByType(@PathVariable Integer typeId) {
        List<RoomResponse> rooms = roomService.findByType(typeId);
        if (rooms.isEmpty()) {
            throw new RoomNotFoundException("No rooms found with type ID: " + typeId);
        }
        return buildResponse("Rooms found successfully", HttpStatus.OK, rooms);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<GeneralResponse> createRoom(@RequestBody @Valid RoomRequest roomRequest) {
        RoomResponse createdRoom = roomService.save(roomRequest);
        return buildResponse("Room created successfully", HttpStatus.CREATED, createdRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> updateRoom(@Valid @PathVariable Integer id, @RequestBody RoomUpdateRequest roomRequest) {
        RoomResponse updatedRoom = roomService.update(id, roomRequest);
        return buildResponse("Room updated successfully", HttpStatus.OK, updatedRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> deleteRoom(@PathVariable Integer id) {
        RoomResponse room = roomService.findById(id);
        roomService.delete(id);
        return buildResponse("Room deleted successfully", HttpStatus.OK, room);
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
