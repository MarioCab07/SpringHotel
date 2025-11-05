package com.group07.hotel_API.repository;


import com.group07.hotel_API.dto.response.Booking.BookingResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.utils.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    @Query(value = """
        SELECT b.*
        FROM booking b
        WHERE b.user_id = :userId
        """, nativeQuery = true)
    List<Booking> findAllByUserId(@Param("userId") Integer userId);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.user.id = :userId AND b.checkOut >= :today
    """)
    List<Booking> findActiveBookingsByUserId(@Param("userId") Integer userId, @Param("today") LocalDate today);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.user.id = :userId AND b.checkOut < :today
    """)
    List<Booking> findPastBookingsByUserId(@Param("userId") Integer userId, @Param("today") LocalDate today);

    List<Booking> findByStatus(BookingStatus status);
    @Query("""
    SELECT b FROM Booking b 
    WHERE b.user.id = :userId AND b.checkIn = :checkIn AND b.status = :status
""")
    Optional<Booking> findByUserIdAndCheckInAndStatus(@Param("userId") int userId,
                                                      @Param("checkIn") LocalDate checkIn,
                                                      @Param("status") BookingStatus status);    Optional<Booking> findByUserIdAndStatus(int userId, BookingStatus status);

    @Query("""
        SELECT b
        FROM Booking b
        WHERE b.room.id = :roomId
          AND b.checkIn <= :today
          AND b.checkOut >= :today
    """)
    Optional<Booking> findActiveBookingByRoomId(@Param("roomId") Integer roomId,
                                                @Param("today") LocalDate today);

}
