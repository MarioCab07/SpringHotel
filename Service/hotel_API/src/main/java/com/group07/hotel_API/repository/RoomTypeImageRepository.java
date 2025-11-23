package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomTypeImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomTypeImageRepository extends JpaRepository<RoomTypeImage, Integer> {

    List<RoomTypeImage> findByRoomType_Id(Integer roomTypeId);

    List<RoomTypeImage> findByRoomType_IdOrderByIdAsc(Integer roomTypeId);
}
