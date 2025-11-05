package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    Optional<RoomType> findByName(String name);
}
