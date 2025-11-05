package com.group07.hotel_API.dto.response.room;

import com.group07.hotel_API.entities.RoomType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponse {
    private Integer roomId;
    private String roomNumber;
    private String roomStatus;
    private RoomType roomType;
    private String lastClean;
}
