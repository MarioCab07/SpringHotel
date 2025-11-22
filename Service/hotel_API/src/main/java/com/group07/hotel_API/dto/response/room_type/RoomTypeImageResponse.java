package com.group07.hotel_API.dto.response.room_type;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomTypeImageResponse {
    private Integer id;
    private String url;
    private String publicId;
    private String altText;
}
