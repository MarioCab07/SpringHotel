package com.group07.hotel_API.repository;


import com.group07.hotel_API.entities.Reason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReasonRepository extends JpaRepository<Reason, Integer> {
    Optional<Reason> findByName(String name);
}
