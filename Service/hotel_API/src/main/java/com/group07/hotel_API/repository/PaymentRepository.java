package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findByBookingId(Integer bookingId);

    List<Payment> findByClientEmail(String clientEmail);

    List<Payment> findByReason(String reason);
}
