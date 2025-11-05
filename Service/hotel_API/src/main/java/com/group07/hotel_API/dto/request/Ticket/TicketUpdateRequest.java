package com.group07.hotel_API.dto.request.Ticket;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TicketUpdateRequest {
    @NotNull(message = "You must provide a subtotal for the room")
    private BigDecimal subtotalRoom;

    @NotNull(message = "You must provide a subtotal for the services")
    private BigDecimal subtotalServices;

    @NotNull(message = "You must provide the IVA")
    private BigDecimal iva;

    @NotNull(message = "You must provide the total amount")
    private BigDecimal total;

    @NotNull(message = "You must provide the status")
    private String status;
}
