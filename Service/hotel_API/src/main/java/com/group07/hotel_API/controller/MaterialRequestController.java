package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.MaterialRequest.MaterialRequestRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.MaterialRequest.MaterialRequestResponse;
import com.group07.hotel_API.exception.token.TokenNotFoundException;
import com.group07.hotel_API.security.JwtTokenProvider;
import com.group07.hotel_API.service.MaterialRequestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/requests")
public class MaterialRequestController {

    private final MaterialRequestService materialRequestService;
    private final JwtTokenProvider jwtTokenProvider;

    public MaterialRequestController(MaterialRequestService materialRequestService, JwtTokenProvider jwtTokenProvider) {
        this.materialRequestService = materialRequestService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PreAuthorize("hasAnyRole('CLEANING_STAFF', 'ADMIN')")
    @PostMapping
    public ResponseEntity<GeneralResponse> createRequest(
            @RequestBody @Valid MaterialRequestRequest request,
            HttpServletRequest httpRequest) {
        
        String token = getTokenFromRequest(httpRequest);
        if (token == null) {
            throw new TokenNotFoundException("Token not found in request");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(token);
        MaterialRequestResponse response = materialRequestService.createRequest(request, username);
        
        return buildResponse("Material request created successfully", HttpStatus.CREATED, response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<GeneralResponse> getAllRequests() {
        List<MaterialRequestResponse> requests = materialRequestService.getAllRequests();
        return buildResponse("All material requests retrieved successfully", HttpStatus.OK, requests);
    }

    @PreAuthorize("hasAnyRole('CLEANING_STAFF', 'ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<GeneralResponse> getMyRequests(HttpServletRequest httpRequest) {
        String token = getTokenFromRequest(httpRequest);
        if (token == null) {
            throw new TokenNotFoundException("Token not found in request");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(token);
        List<MaterialRequestResponse> requests = materialRequestService.getMyRequests(username);
        
        return buildResponse("My material requests retrieved successfully", HttpStatus.OK, requests);
    }

    @PreAuthorize("hasAnyRole('CLEANING_STAFF', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getRequestById(@PathVariable Long id) {
        MaterialRequestResponse request = materialRequestService.getRequestById(id);
        return buildResponse("Material request retrieved successfully", HttpStatus.OK, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<GeneralResponse> approveRequest(@PathVariable Long id) {
        MaterialRequestResponse response = materialRequestService.approveRequest(id);
        return buildResponse("Material request approved successfully", HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<GeneralResponse> rejectRequest(@PathVariable Long id) {
        MaterialRequestResponse response = materialRequestService.rejectRequest(id);
        return buildResponse("Material request rejected successfully", HttpStatus.OK, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .time(LocalDate.now())
                .build());
    }
}

