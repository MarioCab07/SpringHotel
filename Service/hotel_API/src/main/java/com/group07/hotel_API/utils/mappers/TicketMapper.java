package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.Ticket.TicketRequest;
import com.group07.hotel_API.dto.request.Ticket.TicketUpdateRequest;
import com.group07.hotel_API.dto.response.Ticket.TicketResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.Ticket;

import java.util.List;
import java.util.stream.Collectors;

public class TicketMapper {
    public static TicketResponse toDTO(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .bookingId(ticket.getBooking().getId())
                .subtotalRoom(ticket.getSubtotalRoom())
                .subtotalServices(ticket.getSubtotalServices())
                .iva(ticket.getIva())
                .total(ticket.getTotal())
                .issuedAt(ticket.getIssuedAt())
                .status(ticket.getStatus())
                .build();
    }

    public static List<TicketResponse> toDTOList(List<Ticket> tickets) {
        return tickets.stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Ticket toEntity(TicketRequest request, Booking booking) {
        return Ticket.builder()
                .booking(booking)
                .subtotalRoom(request.getSubtotalRoom())
                .subtotalServices(request.getSubtotalServices())
                .iva(request.getIva())
                .status(request.getStatus())
                .build();
    }

    public static void updateEntity(Ticket ticket, TicketUpdateRequest request) {
        ticket.setSubtotalRoom(request.getSubtotalRoom());
        ticket.setSubtotalServices(request.getSubtotalServices());
        ticket.setIva(request.getIva());
        ticket.setStatus(request.getStatus());
    }
}
