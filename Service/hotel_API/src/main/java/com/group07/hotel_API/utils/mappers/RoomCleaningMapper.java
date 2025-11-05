package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningRequest;
import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningUpdateRequest;
import com.group07.hotel_API.dto.response.room_cleaning.RoomCleaningResponse;
import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.entities.RoomCleaning;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.room_cleaning.InvalidRoomCleaningStatusException;
import com.group07.hotel_API.utils.enums.CleaningStatus;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class RoomCleaningMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static RoomCleaning toEntity(RoomCleaningRequest roomCleaningDTO, UserClient user, Room room) {
        return RoomCleaning.builder()
                .room(room)
                .user(user)
                .status(CleaningStatus.fromString(roomCleaningDTO.getStatus().toUpperCase())
                        .orElseThrow(() -> new InvalidRoomCleaningStatusException(roomCleaningDTO.getStatus()))
                )
                .cleanedAt(roomCleaningDTO.getCleanedAt())
                .comments(roomCleaningDTO.getComments())
                .build();
    }

    public static RoomCleaning toEntityUpdate(Integer id, RoomCleaningUpdateRequest roomCleaningDTO, UserClient user, Room room ){
        return RoomCleaning.builder()
                .id(id)
                .room(room)
                .user(user)
                .status(CleaningStatus.fromString(roomCleaningDTO.getStatus().toUpperCase())
                        .orElseThrow(() -> new InvalidRoomCleaningStatusException(roomCleaningDTO.getStatus()))
                )
                .cleanedAt(roomCleaningDTO.getCleanedAt())
                .comments(roomCleaningDTO.getComments())
                .build();
    }

    public static RoomCleaningResponse toDTO(RoomCleaning roomCleaning) {
        return RoomCleaningResponse.builder()
                .id(roomCleaning.getId())
                .roomId(roomCleaning.getRoom().getId())
                .userId(roomCleaning.getUser().getId())
                .status(roomCleaning.getStatus().name())
                .cleanedAt(roomCleaning.getCleanedAt().format(FORMATTER))
                .comments(roomCleaning.getComments())
                .build();
    }

    public static List<RoomCleaningResponse> toDTOList(List<RoomCleaning> roomCleanings) {
        return roomCleanings.stream()
                .map(RoomCleaningMapper::toDTO)
                .toList();
    }
}
