package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.room.RoomRequest;
import com.group07.hotel_API.dto.request.room.RoomUpdateRequest;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.exception.room.InvalidRoomStatusException;
import com.group07.hotel_API.utils.enums.RoomStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class RoomMapper {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static Room toEntityCreate(RoomRequest roomDTO, RoomType roomType){
         return Room.builder()
                .roomNumber(roomDTO.getRoomNumber())
                 .status(RoomStatus.fromString(roomDTO.getRoomStatus().toUpperCase())
                         .orElseThrow(() -> new InvalidRoomStatusException(roomDTO.getRoomStatus()))
                 )
                .roomType(roomType)
                .lastCleanedAt(roomDTO.getLastClean() != null ? LocalDateTime.parse(roomDTO.getLastClean(), F): null)
                .build();
    }

    public static Room toEntityUpdate(Integer id, RoomUpdateRequest roomDTO, RoomType roomType) {
        return Room.builder()
                .id(id)
                .roomNumber(roomDTO.getRoomNumber())
                .status(RoomStatus.fromString(roomDTO.getRoomStatus().toUpperCase())
                        .orElseThrow(() -> new InvalidRoomStatusException(roomDTO.getRoomStatus())))
                .roomType(roomType)
                .lastCleanedAt(roomDTO.getLastClean() != null ? LocalDateTime.parse(roomDTO.getLastClean(), F): null)
                .build();
    }

    public static RoomResponse toDTO(Room room) {
        return RoomResponse.builder()
                .roomId(room.getId())
                .roomStatus(room.getStatus().name())
                .roomType(room.getRoomType())
                .roomNumber(room.getRoomNumber())
                .lastClean(room.getLastCleanedAt() != null ? room.getLastCleanedAt().format(F): null)
                .build();
    }

    public static List<RoomResponse> toDTOList(List<Room> room){
        return room.stream()
                .map(RoomMapper::toDTO)
                .toList();
    }
}
