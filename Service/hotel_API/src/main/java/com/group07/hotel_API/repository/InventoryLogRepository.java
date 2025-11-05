package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
}
