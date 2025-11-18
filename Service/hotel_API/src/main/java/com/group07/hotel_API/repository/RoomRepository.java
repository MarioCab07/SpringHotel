package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.utils.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByStatus(RoomStatus status);
    List<Room> findByRoomType_Id(Integer type);
    boolean existsByRoomNumber(String roomNumber);
    Long countByRoomType_IdAndStatus(Integer typeId, RoomStatus status);

}
