package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomTypeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeReviewRepository extends JpaRepository<RoomTypeReview, Integer> {
    List<RoomTypeReview> findByRoomType_IdOrderByCreatedAtDesc(Integer roomTypeId);
    List<RoomTypeReview> findByUserId(Integer userId);
    boolean existsByRoomType_IdAndUserId(Integer roomTypeId, Integer userId);
}
