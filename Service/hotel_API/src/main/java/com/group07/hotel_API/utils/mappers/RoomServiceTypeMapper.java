package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;
import com.group07.hotel_API.entities.RoomServiceType;

import java.util.List;
import java.util.stream.Collectors;

public class RoomServiceTypeMapper {
    public static RoomServiceType toEntityCreate(RoomServiceTypeRequest request) {
        return RoomServiceType.builder()
                .name(request.getName())
                .price(request.getPrice())
                .build();
    }

    public static RoomServiceType toEntityUpdate(Integer id, RoomServiceTypeUpdateRequest request) {
        return RoomServiceType.builder()
                .id(id)
                .name(request.getName())
                .price(request.getPrice())
                .build();
    }

    public static RoomServiceTypeResponse toDTO(RoomServiceType entity) {
        return RoomServiceTypeResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .price(entity.getPrice())
                .build();
    }

    public static List<RoomServiceTypeResponse> toDTOList(List<RoomServiceType> entities) {
        return entities.stream()
                .map(RoomServiceTypeMapper::toDTO)
                .collect(Collectors.toList());
    }
}
