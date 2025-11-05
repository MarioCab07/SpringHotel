package com.group07.hotel_API.dto.request.room;

import com.group07.hotel_API.entities.RoomType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomRequest {

    @NotNull(message = "Room number cannot be null")
    private String roomNumber;

    @NotNull(message = "Room status cannot be null")
    private String roomStatus;

    @NotNull(message = "Room type cannot be null")
    private int roomType;

    private String lastClean;
}
