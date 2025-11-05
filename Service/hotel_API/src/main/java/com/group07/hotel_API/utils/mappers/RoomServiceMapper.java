package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.room_service.RoomServiceRequest;
import com.group07.hotel_API.dto.request.room_service.RoomServiceUpdateRequest;
import com.group07.hotel_API.dto.response.room_service.RoomServiceResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.RoomService;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.exception.room_service.InvalidRoomServiceRequestException;
import com.group07.hotel_API.utils.enums.ServiceStatus;

import java.util.List;
import java.util.Set;

public class RoomServiceMapper {
    public static RoomService toEntityCreate(RoomServiceRequest request, Booking booking, Set<RoomServiceType> serviceTypes) {
        return RoomService.builder()
                .booking(booking)
                .serviceTypes(serviceTypes)
                .description(request.getRoomServiceDescription())
                .status(ServiceStatus.fromString(request.getRoomServiceStatus().toUpperCase())
                        .orElseThrow(() -> new InvalidRoomServiceRequestException(request.getRoomServiceStatus())))
                .requestedAt(request.getRequestedAt())
                .build();
    }

    public static RoomServiceResponse toDTO(RoomService roomService) {
        return RoomServiceResponse.builder()
                .roomServiceId(roomService.getId())
                .bookingId(roomService.getBooking().getId())
                .serviceTypeIds(roomService.getServiceTypes().stream()
                        .map(RoomServiceType::getId).toList())
                .roomServiceDescription(roomService.getDescription())
                .roomServiceStatus(roomService.getStatus())
                .requestedAt(roomService.getRequestedAt())
                .build();
    }

    public static List<RoomServiceResponse> toDTOList(List<RoomService> entities) {
        return entities.stream()
                .map(RoomServiceMapper::toDTO)
                .toList();
    }
}
