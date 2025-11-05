package com.group07.hotel_API.dto.response.room_service;

import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.utils.enums.ServiceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RoomServiceResponse {
    private Integer roomServiceId;
    private Integer bookingId;
    private List<Integer> serviceTypeIds;
    private String roomServiceDescription;
    private ServiceStatus roomServiceStatus;
    private LocalDateTime requestedAt;
}
