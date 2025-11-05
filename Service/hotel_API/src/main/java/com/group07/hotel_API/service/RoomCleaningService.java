package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningRequest;
import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningUpdateRequest;
import com.group07.hotel_API.dto.response.room_cleaning.RoomCleaningResponse;
import com.group07.hotel_API.utils.enums.CleaningStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface RoomCleaningService {
    List<RoomCleaningResponse> findAll();
    RoomCleaningResponse findById(Integer id);
    List<RoomCleaningResponse> findByRoomId(Integer roomId);
    List<RoomCleaningResponse> findByStatus(CleaningStatus status);
    List<RoomCleaningResponse> findByUserId(Integer userId);
    RoomCleaningResponse create(RoomCleaningRequest request);
    RoomCleaningResponse update(Integer id, RoomCleaningUpdateRequest request);
    List<RoomCleaningResponse> findAllSummaries();
    void delete(Integer id);
}