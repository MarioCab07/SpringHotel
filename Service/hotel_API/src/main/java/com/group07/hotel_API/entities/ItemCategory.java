package com.group07.hotel_API.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public int getQuantity() {
        return inventoryItems != null ? inventoryItems.size() : 0;
    }

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<InventoryItem> inventoryItems;

}
