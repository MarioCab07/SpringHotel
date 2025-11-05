package com.group07.hotel_API.dto.response.room_cleaning;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomCleaningResponse {
    private Integer id;
    private Integer roomId;
    private Integer userId;
    private String status;
    private String cleanedAt;
    private String comments;
}
