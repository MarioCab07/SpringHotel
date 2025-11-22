package com.group07.hotel_API.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_type_image", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "url", nullable = false, length = 1000)
    private String url;

    @Column(name = "public_id", nullable = false, length = 500)
    private String publicId;

    @Column(name = "alt_text")
    private String altText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", referencedColumnName = "id")
    private RoomType roomType;
}
