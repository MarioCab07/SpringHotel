package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.room_service.RoomServiceRequest;
import com.group07.hotel_API.dto.request.room_service.RoomServiceUpdateRequest;
import com.group07.hotel_API.dto.response.room_service.RoomServiceResponse;
import com.group07.hotel_API.utils.enums.ServiceStatus;

import java.util.List;

public interface RoomServiceService {
    List<RoomServiceResponse> findAll();
    RoomServiceResponse findById(Integer id);
    List<RoomServiceResponse> findByBookingId(Integer bookingId);
    List<RoomServiceResponse> findByStatus(ServiceStatus status);
    RoomServiceResponse save(RoomServiceRequest request);
    RoomServiceResponse update(Integer id, RoomServiceUpdateRequest request);
    void deleteById(Integer id);
}
