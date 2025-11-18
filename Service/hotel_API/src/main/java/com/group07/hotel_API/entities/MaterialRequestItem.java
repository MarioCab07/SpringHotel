package com.group07.hotel_API.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "material_request_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    private MaterialRequest materialRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem item;

    @Column(name = "requested_quantity", nullable = false)
    private int requestedQuantity;

    @Column(name = "approved_quantity", nullable = false)
    @Builder.Default
    private int approvedQuantity = 0;
}


