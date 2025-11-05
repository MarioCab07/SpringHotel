package com.group07.hotel_API.repository;


import com.group07.hotel_API.entities.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findByName(String name);

}
