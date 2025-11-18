package com.group07.hotel_API.entities;

import com.group07.hotel_API.utils.enums.CleaningStatus;
import com.group07.hotel_API.utils.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_cleaning", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomCleaning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_room", referencedColumnName = "id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "id_user_client", referencedColumnName = "id")
    private UserClient user;

    @ManyToOne
    @JoinColumn(name = "id_booking", referencedColumnName = "id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CleaningStatus status;

    @Column(name = "cleaned_at")
    private LocalDateTime cleanedAt;

    @Column(name = "comments")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift")
    private ShiftStatus shift;
}
