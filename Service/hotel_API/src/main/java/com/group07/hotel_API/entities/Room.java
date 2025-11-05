package com.group07.hotel_API.entities;

import com.group07.hotel_API.utils.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "room", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "room_number")
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @ManyToOne
    @JoinColumn(name = "id_room_type", referencedColumnName = "id")
    private RoomType roomType;

    @Column(name = "last_cleaned_at")
    private LocalDateTime lastCleanedAt;
}
