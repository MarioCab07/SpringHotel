package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "userClients", schema = "public")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserClient {

    @Id
    @Column(name ="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "username")
    private String username;

    @Column(name = "country")
    private String country;

    @Column(name = "document_number")
    private String documentNumber;

    @Column(name = "password")
    private String password;

    @Column(name="phone_number")
    private String phoneNumber;

    private LocalDate birthDate;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;


}
