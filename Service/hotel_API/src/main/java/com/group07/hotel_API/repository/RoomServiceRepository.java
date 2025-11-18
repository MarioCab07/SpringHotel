package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.RoomService;
import com.group07.hotel_API.utils.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomServiceRepository extends JpaRepository<RoomService, Integer> {
    List<RoomService> findByBookingId(Integer bookingId);
    List<RoomService> findByStatus(ServiceStatus status);
}