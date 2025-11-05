package com.group07.hotel_API.dto.request.Ticket;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TicketRequest {

    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    @NotNull(message = "Room subtotal is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Room subtotal must be greater than 0")
    private BigDecimal subtotalRoom;

    @NotNull(message = "Services subtotal is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Services subtotal must be 0 or more")
    private BigDecimal subtotalServices;

    @NotNull(message = "IVA is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "IVA must be 0 or more")
    private BigDecimal iva;

    @NotNull(message = "Total is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total must be greater than 0")
    private BigDecimal total;

    @NotNull(message = "Status is required")
    private String status;

    }


