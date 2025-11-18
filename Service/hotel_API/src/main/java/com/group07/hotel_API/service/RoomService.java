package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.room.RoomRequest;
import com.group07.hotel_API.dto.request.room.RoomUpdateRequest;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.dto.response.room.RoomTypeSummaryResponse;

import java.util.List;

public interface RoomService {

    List<RoomResponse> findAll();
    RoomResponse findById(Integer id);
    RoomResponse save(RoomRequest room);
    RoomResponse update(Integer id, RoomUpdateRequest room);

    List<RoomResponse> findByStatus(String status);
    List<RoomResponse> findByType(Integer id);

    List<RoomResponse> getAvailableRooms();   // 👈 necesario

    void delete(Integer id);

    List<RoomTypeSummaryResponse> getRoomTypesSummary();

    List<RoomResponse> getRandomAvailableRooms(); // 👈 nuevo
}
