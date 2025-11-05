package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.Ticket.TicketRequest;
import com.group07.hotel_API.dto.request.Ticket.TicketUpdateRequest;
import com.group07.hotel_API.dto.response.Ticket.TicketResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface TicketService {
    List<TicketResponse> findAll();
    TicketResponse findById(int id);
    TicketResponse findByBookingId(int bookingId);
    List<TicketResponse> findByUserId(int userId);
    List<TicketResponse> findActiveTickets();
    List<TicketResponse> findPastTickets();
    TicketResponse save(TicketRequest request);
    TicketResponse update(int id, TicketUpdateRequest request);
    void delete(int id);
}
