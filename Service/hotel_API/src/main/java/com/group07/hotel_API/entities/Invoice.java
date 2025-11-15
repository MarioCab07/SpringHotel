package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@Entity
@Table(name = "invoice",schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String code;

    private String clientName;

    private String clientEmail;


    private Double total;

    private Double IVA;

    private Double subtotal;

    private LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reason",nullable = false)
    private Reason reason;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_transmitter", nullable = false)
    private Transmitter transmitter;

//    // 🔹 Relación con PaymentMethod
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    // 🔹 Relación con Booking
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_booking", nullable = false)
    private Booking booking;

    @OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceDetail> details = new ArrayList<>();

}
