package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.response.Payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse processPayment(String clientName,
                                   String clientEmail,
                                   Double subtotal,
                                   Double iva,
                                   Double total,
                                   Long paymentMethodId,
                                   Integer bookingId,
                                   String reason);
}
