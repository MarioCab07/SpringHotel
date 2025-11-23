package com.group07.hotel_API.dto.request.room_cleaning;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RoomCleaningUpdateRequest {
    @NotNull(message = "ID cannot be null")
    private Integer id;

    @NotNull(message = "Room ID cannot be null")
    private Integer roomId;

    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    private Integer bookingId;   // opcional

    @NotBlank(message = "Status cannot be blank")
    private String status;

    @NotNull(message = "Cleaned at cannot be null")
    private LocalDateTime cleanedAt;

    private String comments;

    @NotBlank(message = "Shift cannot be blank")
    private String shift;
}
