package com.group07.hotel_API.controller;

import com.group07.hotel_API.dao.InvoiceData;
import com.group07.hotel_API.dto.request.Payment.PaymentRequest;
import com.group07.hotel_API.dto.response.Payment.PaymentResponse;
import com.group07.hotel_API.entities.Payment;
import com.group07.hotel_API.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/booking")
    public ResponseEntity<Map<String, Object>> processBookingPayment(@RequestBody PaymentRequest req) {
        return processGenericPayment(req, "Booking");
    }

    @PostMapping("/checkin")
    public ResponseEntity<Map<String, Object>> processCheckInPayment(@RequestBody PaymentRequest req) {
        return processGenericPayment(req, "Check-in");
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> processCheckOutPayment(@RequestBody PaymentRequest req) {
        return processGenericPayment(req, "Check-out");
    }


    private ResponseEntity<Map<String, Object>> processGenericPayment(PaymentRequest req, String type) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentResponse payment = paymentService.processPayment(
                    req.getClientName(),
                    req.getClientEmail(),
                    req.getSubtotal(),
                    req.getIva(),
                    req.getTotal(),
                    req.getPaymentMethodId(),
                    req.getBookingId(),
                    type // motivo pago
            );


            response.put("success", true);
            response.put("paymentId", payment.getId());
            response.put("message", payment.getMessage());
            response.put("total", payment.getTotal());
            response.put("method", payment.getPaymentMethod());
            response.put("date", payment.getPaymentDate());


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.getCause().printStackTrace();
            response.put("success", false);
            response.put("message", " Error procesando el pago: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


    }

