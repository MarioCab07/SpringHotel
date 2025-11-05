package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningRequest;
import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.dto.response.room_cleaning.RoomCleaningResponse;
import com.group07.hotel_API.exception.room_cleaning.RoomCleaningNotFoundException;
import com.group07.hotel_API.service.RoomCleaningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/room-cleaning")
@RequiredArgsConstructor
public class RoomCleaningController {

    private final RoomCleaningService roomCleaningService;

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAll() {
        List<RoomCleaningResponse> cleanings = roomCleaningService.findAll();

        if (cleanings.isEmpty()) {
            throw new RoomCleaningNotFoundException("No room cleaning records found.");
        }

        return buildResponse("Room cleaning records found.", HttpStatus.OK, cleanings);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getById(@PathVariable Integer id) {
        RoomCleaningResponse cleaning = roomCleaningService.findById(id);
        return buildResponse("Room cleaning record found.", HttpStatus.OK, cleaning);
    }

    @PreAuthorize("hasAnyRole('ADMIN','CLEANING_STAFF')")
    @GetMapping("/room/{roomId}")
    public ResponseEntity<GeneralResponse> getByRoomId(@PathVariable Integer roomId) {
        List<RoomCleaningResponse> list = roomCleaningService.findByRoomId(roomId);
        if (list.isEmpty()) {
            throw new RoomCleaningNotFoundException("No cleaning records for room " + roomId);
        }
        return buildResponse("Cleaning records for room " + roomId,HttpStatus.OK,list);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @GetMapping("/room-summary")
    public ResponseEntity<GeneralResponse> getRoomCleaningSummary() {
        List<RoomCleaningResponse> summary = roomCleaningService.findAllSummaries();
        if (summary.isEmpty()) {
            throw new RoomCleaningNotFoundException("No room cleaning summaries found.");
        }
        return buildResponse("Room cleaning summaries found.", HttpStatus.OK, summary);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PostMapping
    public ResponseEntity<GeneralResponse> create(@RequestBody RoomCleaningRequest request) {
        RoomCleaningResponse created = roomCleaningService.create(request);
        return buildResponse("Room cleaning record created.", HttpStatus.CREATED, created);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<GeneralResponse> update(@PathVariable Integer id, @RequestBody RoomCleaningUpdateRequest request) {
        RoomCleaningResponse updated = roomCleaningService.update(id, request);
        return buildResponse("Room cleaning record updated.", HttpStatus.OK, updated);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> delete(@PathVariable Integer id) {
        RoomCleaningResponse cleaning = roomCleaningService.findById(id);
        roomCleaningService.delete(id);
        return buildResponse("Room cleaning record deleted.", HttpStatus.OK, cleaning);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(
                GeneralResponse.builder()
                        .message(message)
                        .status(status.value())
                        .data(data)
                        .uri(uri)
                        .time(LocalDate.now())
                        .build()
        );
    }
}
