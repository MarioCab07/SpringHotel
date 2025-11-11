package com.group07.hotel_API.dto.request.Payment;

import lombok.Data;

@Data
public class PaymentRequest {
    private String clientName;
    private String clientEmail;
    private Double subtotal;
    private Double iva;
    private Double total;
    private Long paymentMethodId;
    private Integer bookingId;
    private String reason;
}
