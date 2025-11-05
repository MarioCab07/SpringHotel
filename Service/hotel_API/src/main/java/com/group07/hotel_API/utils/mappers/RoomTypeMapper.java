package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.room_type.RoomTypeRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_type.RoomTypeResponse;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.entities.RoomType;

import java.util.List;

public class RoomTypeMapper {
    public static RoomType toEntityCreate(RoomTypeRequest request) {
        return RoomType.builder()
                .name(request.getRoomTypeName())
                .description(request.getDescription())
                .price(request.getPricePerNight())
                .build();
    }

    public static RoomType toEntityUpdate(Integer id, RoomTypeUpdateRequest request) {
        return RoomType.builder()
                .id(id)
                .name(request.getRoomTypeName())
                .description(request.getDescription())
                .price(request.getPricePerNight())
                .build();
    }

    public static RoomTypeResponse toDTO(RoomType roomType){
        return RoomTypeResponse.builder()
                .roomTypeId(roomType.getId())
                .roomTypeName(roomType.getName())
                .description(roomType.getDescription())
                .pricePerNight(roomType.getPrice())
                .build();
    }

    public static List<RoomTypeResponse> toDTOList(List<RoomType> roomTypes){
        return roomTypes.stream()
                .map(RoomTypeMapper::toDTO)
                .toList();
    }
}
