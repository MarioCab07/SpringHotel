package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomCleaning;
import com.group07.hotel_API.utils.enums.CleaningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomCleaningRepository extends JpaRepository<RoomCleaning,Integer> {
    List<RoomCleaning> findByRoomId(Integer roomId);
    List<RoomCleaning> findByStatus(CleaningStatus status);
    List<RoomCleaning> findByUserId(Integer userId);
    @Query("""
        SELECT rc FROM RoomCleaning rc
        JOIN FETCH rc.room r
        JOIN FETCH rc.user u
        """)
    List<RoomCleaning> findAllSummaries();
    Optional<RoomCleaning> findTopByRoomIdOrderByCleanedAtDesc(Integer roomId);
}
