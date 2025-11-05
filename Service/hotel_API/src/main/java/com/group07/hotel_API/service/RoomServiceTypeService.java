package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;

import java.util.List;

public interface RoomServiceTypeService {
    List<RoomServiceTypeResponse> findAll();
    RoomServiceTypeResponse findById(Integer id);
    RoomServiceTypeResponse save(RoomServiceTypeRequest request);
    RoomServiceTypeResponse update(Integer id, RoomServiceTypeUpdateRequest request);
    void delete(Integer id);
}
