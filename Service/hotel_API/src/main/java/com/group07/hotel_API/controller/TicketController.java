package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.Ticket.TicketRequest;
import com.group07.hotel_API.dto.request.Ticket.TicketUpdateRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.Ticket.TicketResponse;
import com.group07.hotel_API.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> createTicket(@Valid @RequestBody TicketRequest request) {
        TicketResponse response = ticketService.save(request);
        return buildResponse("Ticket created", HttpStatus.CREATED, response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getAllTickets() {
        var tickets = ticketService.findAll();
        return buildResponse("All tickets retrieved", HttpStatus.OK, tickets);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getTicketById(@PathVariable int id) {
        var ticket = ticketService.findById(id);
        return buildResponse("Ticket retrieved", HttpStatus.OK, ticket);
    }


    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getTicketByBookingId(@PathVariable int bookingId) {
        var ticket = ticketService.findByBookingId(bookingId);
        return buildResponse("Ticket by booking retrieved", HttpStatus.OK, ticket);
    }


    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getTicketsByUserId(@PathVariable int userId) {
        var tickets = ticketService.findByUserId(userId);
        return buildResponse("User tickets retrieved", HttpStatus.OK, tickets);
    }


    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getActiveTickets() {
        var tickets = ticketService.findActiveTickets();
        return buildResponse("Active tickets retrieved", HttpStatus.OK, tickets);
    }


    @GetMapping("/past")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> getPastTickets() {
        var tickets = ticketService.findPastTickets();
        return buildResponse("Past tickets retrieved", HttpStatus.OK, tickets);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<GeneralResponse> updateTicket(@PathVariable int id, @Valid @RequestBody TicketUpdateRequest request) {
        var updatedTicket = ticketService.update(id, request);
        return buildResponse("Ticket updated", HttpStatus.OK, updatedTicket);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> deleteTicket(@PathVariable int id) {
        var ticket = ticketService.findById(id);
        ticketService.delete(id);
        return buildResponse("Ticket deleted", HttpStatus.OK, ticket);
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