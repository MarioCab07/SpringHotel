package com.group07.hotel_API.dto.request.room;

import com.group07.hotel_API.entities.RoomType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class    RoomUpdateRequest {
    @NotNull(message = "You must provide a room ID")
    private Integer roomId;
    private String roomNumber;
    private String roomStatus;
    private int roomType;
    private String lastClean;
}
