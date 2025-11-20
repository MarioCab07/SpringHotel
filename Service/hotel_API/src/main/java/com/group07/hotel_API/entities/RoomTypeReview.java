package com.group07.hotel_API.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_type_review", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // relación many-to-one con RoomType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_room_type", referencedColumnName = "id", nullable = false)
    private RoomType roomType;

    // referencia al id del usuario (ajusta si tu PK de users no es Integer)
    @Column(name = "id_user", nullable = false)
    private Integer userId;

    @Column(name = "rating", nullable = false)
    private Short rating; // 1..5

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
