package com.group07.hotel_API.entities;

import com.group07.hotel_API.utils.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@Entity
@Table(name="booking", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "check_in")
    @NotNull
    private LocalDate checkIn;

    @Column(name = "check_out")
    @NotNull
    private LocalDate checkOut;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserClient user;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private Room room;

    @Column(name = "status")
    @NotNull
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
