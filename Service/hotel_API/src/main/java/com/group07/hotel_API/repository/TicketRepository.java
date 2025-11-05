package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    @Query(value = """
        SELECT t.* 
        FROM ticket t 
        JOIN booking b ON t.booking_id = b.id 
        WHERE b.user_id = :userId
        """, nativeQuery = true)
    List<Ticket> findAllByUserId(@Param("userId") Integer userId);

    @Query("""
        SELECT t FROM Ticket t 
        WHERE t.booking.user.id = :userId AND t.status = 'ACTIVE'
        """)
    List<Ticket> findActiveTicketsByUserId(@Param("userId") Integer userId);

    @Query("""
        SELECT t FROM Ticket t 
        WHERE t.booking.user.id = :userId AND t.status = 'CLOSED'
        """)
    List<Ticket> findPastTicketsByUserId(@Param("userId") Integer userId);

    Optional<Ticket> findByBookingId(int bookingId);

    List<Ticket> findByStatus(String status);
}