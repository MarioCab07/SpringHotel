package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@Table(name = "reason",schema = "public")
@AllArgsConstructor
@NoArgsConstructor
public class Reason {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reason_id")
    private int reasonId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;
}
