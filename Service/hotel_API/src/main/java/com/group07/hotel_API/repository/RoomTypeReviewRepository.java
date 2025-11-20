package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomTypeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoomTypeReviewRepository extends JpaRepository<RoomTypeReview, Integer> {
    List<RoomTypeReview> findByRoomType_IdOrderByCreatedAtDesc(Integer roomTypeId);
    List<RoomTypeReview> findByUserId(Integer userId);
    boolean existsByRoomType_IdAndUserId(Integer roomTypeId, Integer userId);

    @Query("SELECT COUNT(r) FROM RoomTypeReview r WHERE r.roomType.id = :roomTypeId")
    long countByRoomTypeId(@Param("roomTypeId") Integer roomTypeId);

    @Query("SELECT AVG(r.rating) FROM RoomTypeReview r WHERE r.roomType.id = :roomTypeId")
    Double averageRatingByRoomTypeId(@Param("roomTypeId") Integer roomTypeId);
}
