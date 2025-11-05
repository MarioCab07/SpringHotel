package com.group07.hotel_API.dto.response.Ticket;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {
    private Integer id;
    private Integer bookingId;
    private BigDecimal subtotalRoom;
    private BigDecimal subtotalServices;
    private BigDecimal iva;
    private BigDecimal total;
    private LocalDateTime issuedAt;
    private String status;
}
