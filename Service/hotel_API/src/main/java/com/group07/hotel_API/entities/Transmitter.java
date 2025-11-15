package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@Entity
@Table(name = "transmitter",schema = "public")
@AllArgsConstructor
@NoArgsConstructor
public class Transmitter {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name="name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "line of business")
    private String lineOfBusiness;

    @Column(name = "NIT")
    private String nit;

    @Column(name = "email")
    private String email;
}
