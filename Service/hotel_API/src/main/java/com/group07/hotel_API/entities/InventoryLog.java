package com.group07.hotel_API.entities;


import com.group07.hotel_API.utils.enums.Action;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_log")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder

public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem item;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private UserClient user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Action action;

    @Column(name = "quantity_changed", nullable = false)
    private int quantityChanged;

    @Column(nullable = false)
    private String timestamp;
}
