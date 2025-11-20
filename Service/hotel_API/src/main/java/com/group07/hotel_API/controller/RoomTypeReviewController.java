package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.review.RoomTypeReviewRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.review.ReviewSummary;
import com.group07.hotel_API.dto.response.review.RoomTypeReviewResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;
import com.group07.hotel_API.service.AuthService;
import com.group07.hotel_API.service.RoomTypeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/room_type")
@RequiredArgsConstructor
public class RoomTypeReviewController {

    private final RoomTypeReviewService service;
    private final AuthService authService;

    @GetMapping("/{roomTypeId}/reviews")
    public ResponseEntity<GeneralResponse> list(@PathVariable Integer roomTypeId) {
        List<RoomTypeReviewResponse> data = service.listByRoomType(roomTypeId);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.ok(GeneralResponse.builder()
                .uri(uri).message("Reviews retrieved").status(HttpStatus.OK.value()).data(data).build());
    }

    @GetMapping("/{roomTypeId}/reviews/summary")
    public ResponseEntity<GeneralResponse> getSummary(@PathVariable Integer roomTypeId) {
        ReviewSummary summary = service.getSummaryByRoomType(roomTypeId);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.ok(GeneralResponse.builder()
                .uri(uri).message("Review summary retrieved").status(HttpStatus.OK.value()).data(summary).time(LocalDate.now()).build());
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN','EMPLOYEE')")
    @PostMapping("/{roomTypeId}/reviews")
    public ResponseEntity<GeneralResponse> create(
            @PathVariable Integer roomTypeId,
            @Valid @RequestBody RoomTypeReviewRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Integer userId = extractUserIdFromAuthHeader(authorizationHeader);
        var created = service.createReview(roomTypeId, userId, request);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GeneralResponse.builder()
                        .uri(uri).message("Review created").status(HttpStatus.CREATED.value()).data(created).build());
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN','EMPLOYEE')")
    @DeleteMapping("/{roomTypeId}/reviews/{reviewId}")
    public ResponseEntity<GeneralResponse> delete(
            @PathVariable Integer roomTypeId,
            @PathVariable Integer reviewId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Integer userId = extractUserIdFromAuthHeader(authorizationHeader);
        boolean isAdmin = userHasRoleAdmin(authorizationHeader);
        service.deleteReview(roomTypeId, reviewId, userId, isAdmin);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.ok(GeneralResponse.builder()
                .uri(uri).message("Review deleted").status(HttpStatus.OK.value()).data(null).build());
    }

    private Integer extractUserIdFromAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token not found in Authorization header");
        }
        String token = authorizationHeader.substring(7);
        UserResponse user = authService.getUserDetails(token);
        if (user == null || user.getUserId() == null) {
            throw new RuntimeException("Unable to retrieve user id from token");
        }
        return user.getUserId();
    }

    private boolean userHasRoleAdmin(String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) return false;
            String token = authorizationHeader.substring(7);
            UserResponse user = authService.getUserDetails(token);
            if (user != null && user.getRole() != null) {
                return "ADMIN".equalsIgnoreCase(user.getRole());
            }
        } catch (Exception ignored) {}
        return false;
    }
}
