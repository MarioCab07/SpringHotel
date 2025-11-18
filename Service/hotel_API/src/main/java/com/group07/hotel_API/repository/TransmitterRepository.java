package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.Transmitter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransmitterRepository extends JpaRepository<Transmitter, UUID> {
    Optional<Transmitter> findByName(String name);

}
