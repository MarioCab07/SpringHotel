package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.MaterialRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRequestItemRepository extends JpaRepository<MaterialRequestItem, Long> {
}


