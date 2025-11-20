package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.review.RoomTypeReviewRequest;
import com.group07.hotel_API.dto.response.review.ReviewSummary;
import com.group07.hotel_API.dto.response.review.RoomTypeReviewResponse;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.group07.hotel_API.entities.RoomTypeReview;
import com.group07.hotel_API.exception.room_type.RoomTypeNotFoundException;
import com.group07.hotel_API.exception.review.ReviewNotAllowedException;
import com.group07.hotel_API.exception.review.ReviewNotFoundException;
import com.group07.hotel_API.repository.RoomTypeReviewRepository;
import com.group07.hotel_API.repository.RoomTypeRepository;
import com.group07.hotel_API.service.RoomTypeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTypeReviewServiceImpl implements RoomTypeReviewService {

    private final RoomTypeReviewRepository reviewRepo;
    private final RoomTypeRepository roomTypeRepo;
    private final UserRepository userRepository;

    @Override
    public List<RoomTypeReviewResponse> listByRoomType(Integer roomTypeId) {
        roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found: " + roomTypeId));

        return reviewRepo.findByRoomType_IdOrderByCreatedAtDesc(roomTypeId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ReviewSummary getSummaryByRoomType(Integer roomTypeId) {
        // validar existencia del tipo
        roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found: " + roomTypeId));

        long count = reviewRepo.countByRoomTypeId(roomTypeId);
        Double avg = reviewRepo.averageRatingByRoomTypeId(roomTypeId);
        // redondea a 1 decimal si no es null
        Double rounded = null;
        if (avg != null) {
            rounded = Math.round(avg * 10.0) / 10.0;
        }
        return new ReviewSummary(count, rounded);
    }

    @Override
    @Transactional
    public RoomTypeReviewResponse createReview(Integer roomTypeId, Integer userId, RoomTypeReviewRequest request) {
        RoomType rt = roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found: " + roomTypeId));


        if (reviewRepo.existsByRoomType_IdAndUserId(roomTypeId, userId)) {
            throw new ReviewNotAllowedException("User already reviewed this room type");
        }

        RoomTypeReview rev = RoomTypeReview.builder()
                .roomType(rt)
                .userId(userId)
                .rating((short) request.getRating())
                .comment(request.getComment())
                .build();

        RoomTypeReview saved = reviewRepo.save(rev);
        return toDto(saved);
    }

    @Override
    @Transactional
    public void deleteReview(Integer roomTypeId, Integer reviewId, Integer userId, boolean isAdmin) {
        RoomTypeReview r = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found: " + reviewId));

        if (!r.getRoomType().getId().equals(roomTypeId)) {
            throw new ReviewNotAllowedException("Review does not belong to this room type");
        }
        if (!isAdmin && !r.getUserId().equals(userId)) {
            throw new ReviewNotAllowedException("No permission to delete review");
        }
        reviewRepo.delete(r);
    }

    private RoomTypeReviewResponse toDto(RoomTypeReview e) {
        // Busca el usuario por id y obtiene su username (si existe)
        String username = "Usuario";
        try {
            if (e.getUserId() != null) {
                UserClient user = userRepository.findById(e.getUserId()).orElse(null);
                if (user != null && user.getUsername() != null && !user.getUsername().isBlank()) {
                    username = user.getUsername();
                }
            }
        } catch (Exception ex) {

        }

        return RoomTypeReviewResponse.builder()
                .id(e.getId())
                .userId(e.getUserId())
                .userName(username)
                .rating(e.getRating() != null ? e.getRating().intValue() : null)
                .comment(e.getComment())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
