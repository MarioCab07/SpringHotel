package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.response.Payment.PaymentResponse;
import com.group07.hotel_API.entities.Payment;
import com.group07.hotel_API.entities.PaymentMethod;
import com.group07.hotel_API.repository.PaymentMethodRepository;
import com.group07.hotel_API.repository.PaymentRepository;
import com.group07.hotel_API.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    public PaymentResponse processPayment(String clientName,
                                          String clientEmail,
                                          Double subtotal,
                                          Double iva,
                                          Double total,
                                          Long paymentMethodId,
                                          Integer bookingId,
                                          String reason) {

        var method = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Método de pago no encontrado con ID: " + paymentMethodId));

        Payment payment = Payment.builder()
                .clientName(clientName)
                .clientEmail(clientEmail)
                .subtotal(subtotal)
                .iva(iva)
                .total(total)
                .paymentMethod(method)
                .bookingId(bookingId)
                .paymentDate(LocalDateTime.now())
                .status("PAID")
                .reason(reason.toUpperCase())
                .build();

        paymentRepository.save(payment);
        //ACA IMPLEMENTARE FACTURACION

        return PaymentResponse.builder()
                .id(payment.getId())
                .clientName(payment.getClientName())
                .clientEmail(payment.getClientEmail())
                .subtotal(payment.getSubtotal())
                .iva(payment.getIva())
                .total(payment.getTotal())
                .paymentMethod(payment.getPaymentMethod().getName())
                .bookingId(payment.getBookingId())
                .status(payment.getStatus())
                .reason(payment.getReason())
                .paymentDate(payment.getPaymentDate())
                .message(" Pago registrado correctamente (" + reason.toUpperCase() + ").")
                .build();
    }
}
