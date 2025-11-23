package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.review.RoomTypeReviewRequest;
import com.group07.hotel_API.dto.response.review.RoomTypeReviewResponse;

import java.util.List;

import com.group07.hotel_API.dto.response.review.ReviewSummary;

public interface RoomTypeReviewService {
    List<RoomTypeReviewResponse> listByRoomType(Integer roomTypeId);
    RoomTypeReviewResponse createReview(Integer roomTypeId, Integer userId, RoomTypeReviewRequest request);
    void deleteReview(Integer roomTypeId, Integer reviewId, Integer userId, boolean isAdmin);

    ReviewSummary getSummaryByRoomType(Integer roomTypeId);
}
