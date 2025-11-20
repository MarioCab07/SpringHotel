package com.group07.hotel_API.repository;

import com.group07.hotel_API.dao.RoomServiceData;
import com.group07.hotel_API.entities.RoomService;
import com.group07.hotel_API.utils.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomServiceRepository extends JpaRepository<RoomService, Integer> {
    List<RoomService> findByBookingId(Integer bookingId);
    List<RoomService> findByStatus(ServiceStatus status);

    @Query(value = """
    SELECT rss.room_service_id AS roomServiceId,
           rss.service_type_id AS serviceTypeId,
           st.name AS name,
           st.price AS price
    FROM room_service_service_type rss
    INNER JOIN room_service rs ON rss.room_service_id = rs.id
    INNER JOIN room_service_type st ON st.id = rss.service_type_id
    WHERE rs.id_booking = :bookingId
""", nativeQuery = true)
    List<Object[]> findServiceDataByBookingId(@Param("bookingId") Integer bookingId);
}