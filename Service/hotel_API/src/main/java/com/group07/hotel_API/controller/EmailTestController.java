package com.group07.hotel_API.controller;

import com.group07.hotel_API.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-mail")
@RequiredArgsConstructor
public class EmailTestController {
    private final EmailService emailService;


}
