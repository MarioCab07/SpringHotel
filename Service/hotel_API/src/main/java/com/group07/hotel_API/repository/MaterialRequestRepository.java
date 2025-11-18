package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.MaterialRequest;
import com.group07.hotel_API.entities.UserClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRequestRepository extends JpaRepository<MaterialRequest, Long> {
    List<MaterialRequest> findByRequestedBy(UserClient user);
    List<MaterialRequest> findByRequestedByOrderByRequestDateDesc(UserClient user);
}


