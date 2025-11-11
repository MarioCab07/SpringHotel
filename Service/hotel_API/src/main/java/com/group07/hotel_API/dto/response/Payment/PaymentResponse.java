package com.group07.hotel_API.dto.response.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {

    private UUID id;
    private String clientName;
    private String clientEmail;
    private Double subtotal;
    private Double iva;
    private Double total;
    private String paymentMethod;
    private Integer bookingId;
    private String status;
    private String reason;
    private LocalDateTime paymentDate;
    private String message;
}
