package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@Table(name = "invoice_detail",schema = "public")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "id_invoice")
    private Invoice invoice;

    private String code;

    private float subtotal;

    private int bookingDays;

    private Integer idProduct;

    private String productName;

}
