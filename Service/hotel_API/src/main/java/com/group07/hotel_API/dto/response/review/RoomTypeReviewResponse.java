package com.group07.hotel_API.dto.response.review;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RoomTypeReviewResponse {
    private Integer id;
    private Integer userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
