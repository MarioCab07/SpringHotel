package com.group07.hotel_API.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@Entity
@Table(name = "ticket", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @OneToOne
        @JoinColumn(name = "booking_id", referencedColumnName = "id")
        @NotNull
        private Booking booking;

        @Column(name = "subtotal_room")
        @NotNull
        private BigDecimal subtotalRoom;

        @Column(name = "subtotal_services")
        @NotNull
        private BigDecimal subtotalServices;

        @Column(name = "iva")
        @NotNull
        private BigDecimal iva;

        @Column(name = "total")
        @NotNull
        private BigDecimal total;

        @Column(name = "issued_at")
        @NotNull
        private LocalDateTime issuedAt;

        @Column(name = "status")
        @NotNull
        private String status;
}
