package com.group07.hotel_API.dto.response.Booking;

import com.group07.hotel_API.dto.response.Ticket.TicketResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class BookingHistoryResponse {
    private Integer id;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    
    private Integer userId;
    private String userName;
    private String userEmail;
    
    private Integer roomId;
    private String roomNumber;
    private String roomType;
    private String roomStatus;
    
    // Servicios adicionales consumidos
    private List<BookingServiceItemResponse> services;
    
    // Factura asociada (puede ser null si no hay ticket generado)
    private TicketResponse ticket;
    
    // Total pagado (calculado desde el ticket o desde la reserva)
    private Double totalPaid;
}

