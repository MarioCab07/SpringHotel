package com.group07.hotel_API.dto.request.room_service;

import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.utils.enums.ServiceStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RoomServiceUpdateRequest {

    @NotEmpty(message = "Service type IDs cannot be empty")
    private List<Integer> serviceTypeIds;

    @NotNull(message = "Room service status cannot be null")
    private String roomServiceStatus;
}
