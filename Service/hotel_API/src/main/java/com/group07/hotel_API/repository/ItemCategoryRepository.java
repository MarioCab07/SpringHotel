package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Long> {
}
