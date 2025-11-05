package com.group07.hotel_API.dto.request.room_cleaning;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RoomCleaningRequest {
    @NotNull(message = "Room roomID cannot be null")
    private Integer roomId;
    @NotNull(message = "User userID cannot be null")
    private Integer userId;
    @NotBlank(message = "Status cannot be blank")
    private String status;
    @NotNull(message = "Cleaned at cannot be null")
    @FutureOrPresent(message = "Cleaned at must be in the present or future")
    private LocalDateTime cleanedAt;
    private String comments;
}
