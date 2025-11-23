package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.room_type.RoomTypeRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_type.RoomTypeResponse;
import com.group07.hotel_API.entities.RoomType;

import java.util.List;

public interface RoomTypeService {
    List<RoomTypeResponse> findAll();
    RoomType findById(Integer id);
    RoomTypeResponse findDtoById(Integer id);
    RoomTypeResponse save(RoomTypeRequest request);
    RoomTypeResponse update(Integer id, RoomTypeUpdateRequest request);
    void delete(Integer id);
    List<RoomType> findAllEntities();

}
