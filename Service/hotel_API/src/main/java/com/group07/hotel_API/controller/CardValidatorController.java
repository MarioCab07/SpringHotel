package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.Payment.CardValidatorRequest;
import com.group07.hotel_API.service.CardValidatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CardValidatorController {

    private final CardValidatorService cardValidatorService;

    @PostMapping("/validate-card")
    public ResponseEntity<?> validateCard(@RequestBody CardValidatorRequest req) {

        if (!cardValidatorService.luhnCheck(req.getCardNumber())) {
            return ResponseEntity.badRequest().body("Invalid card number");
        }

        if (!cardValidatorService.isValidExpiry(req.getMonth(), req.getYear())) {
            return ResponseEntity.badRequest().body("Invalid expiry date");
        }

        if (!cardValidatorService.isValidCvv(req.getCvv())) {
            return ResponseEntity.badRequest().body("Invalid CVV");
        }

        return ResponseEntity.ok("Card is valid");
    }
}
