package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.Ticket.TicketRequest;
import com.group07.hotel_API.dto.request.Ticket.TicketUpdateRequest;
import com.group07.hotel_API.dto.response.Ticket.TicketResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.Ticket;
import com.group07.hotel_API.exception.Booking.BookingNotFoundException;
import com.group07.hotel_API.exception.Ticket.TicketNotFoundException;
import com.group07.hotel_API.repository.BookingRepository;
import com.group07.hotel_API.repository.TicketRepository;
import com.group07.hotel_API.service.TicketService;
import com.group07.hotel_API.utils.mappers.TicketMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service

public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public TicketServiceImpl(TicketRepository ticketRepository, BookingRepository bookingRepository) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<TicketResponse> findAll() {
        return TicketMapper.toDTOList(ticketRepository.findAll());
    }

    @Override
    public TicketResponse findById(int id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));
        return TicketMapper.toDTO(ticket);
    }

    @Override
    public TicketResponse findByBookingId(int bookingId) {
        Ticket ticket = ticketRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found for booking id: " + bookingId));
        return TicketMapper.toDTO(ticket);
    }

    @Override
    public List<TicketResponse> findByUserId(int userId) {
        return TicketMapper.toDTOList(ticketRepository.findAllByUserId(userId));
    }

    @Override
    public List<TicketResponse> findActiveTickets() {
        return TicketMapper.toDTOList(ticketRepository.findByStatus("ACTIVE"));
    }

    @Override
    public List<TicketResponse> findPastTickets() {
        return TicketMapper.toDTOList(ticketRepository.findByStatus("CLOSED"));
    }

    @Override
    @Transactional
    public TicketResponse save(TicketRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + request.getBookingId()));

        BigDecimal total = request.getSubtotalRoom()
                .add(request.getSubtotalServices())
                .add(request.getIva());

        Ticket ticket = Ticket.builder()
                .booking(booking)
                .subtotalRoom(request.getSubtotalRoom())
                .subtotalServices(request.getSubtotalServices())
                .iva(request.getIva())
                .total(total)
                .issuedAt(LocalDateTime.now())
                .status(request.getStatus())
                .build();

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Transactional
    public TicketResponse update(int id, TicketUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));

        TicketMapper.updateEntity(ticket, request);

        BigDecimal total = request.getSubtotalRoom()
                .add(request.getSubtotalServices())
                .add(request.getIva());

        ticket.setTotal(total);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public void delete(int id) {
        if (!ticketRepository.existsById(id)) {
            throw new TicketNotFoundException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }
}
