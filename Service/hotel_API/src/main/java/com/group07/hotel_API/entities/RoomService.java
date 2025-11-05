package com.group07.hotel_API.entities;

import com.group07.hotel_API.utils.enums.ServiceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "room_service", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_booking", referencedColumnName = "id")
    private Booking booking;

    @ManyToMany
    @JoinTable(
            name = "room_service_service_type",
            joinColumns = @JoinColumn(name = "room_service_id"),
            inverseJoinColumns = @JoinColumn(name = "service_type_id")
    )
    private Set<RoomServiceType> serviceTypes = new HashSet<>();

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ServiceStatus status;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;
}