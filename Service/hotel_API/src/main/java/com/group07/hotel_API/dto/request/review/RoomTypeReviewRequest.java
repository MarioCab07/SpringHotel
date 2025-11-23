package com.group07.hotel_API.dto.request.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomTypeReviewRequest {
    @Min(1) @Max(5)
    private int rating;

    @Size(max = 2000)
    private String comment;
}
