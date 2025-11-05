package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeUpdateRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeRequest;
import com.group07.hotel_API.dto.request.room_type.RoomTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;
import com.group07.hotel_API.dto.response.room_type.RoomTypeResponse;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.exception.room_service_type.RoomServiceTypeNotFoundException;
import com.group07.hotel_API.exception.room_type.RoomTypeNotFoundException;
import com.group07.hotel_API.repository.RoomTypeRepository;
import com.group07.hotel_API.service.RoomTypeService;
import com.group07.hotel_API.utils.mappers.RoomServiceTypeMapper;
import com.group07.hotel_API.utils.mappers.RoomTypeMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {
    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public RoomTypeServiceImpl(RoomTypeRepository repository) {
        this.roomTypeRepository = repository;
    }

    @Override
    public List<RoomTypeResponse> findAll(){
        return RoomTypeMapper.toDTOList(roomTypeRepository.findAll());
    }

    @Override
    @Transactional
    public RoomTypeResponse save(RoomTypeRequest request) {
        var entity = RoomTypeMapper.toEntityCreate(request);
        var saved = roomTypeRepository.save(entity);
        return RoomTypeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public RoomTypeResponse update(Integer id, RoomTypeUpdateRequest roomType) {
        var existing = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found with ID: " + id));

        var entity = RoomTypeMapper.toEntityUpdate(id, roomType);
        var updated = roomTypeRepository.save(entity);
        return RoomTypeMapper.toDTO(updated);
    }

    @Override
    public RoomType findById(Integer id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found with id: " + id));
    }

    public RoomTypeResponse findDtoById(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found with id: " + id));
        return RoomTypeMapper.toDTO(roomType);
    }

    @Override
    public void delete(Integer id) {
        RoomType entity = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room service not found with id " + id));
        roomTypeRepository.delete(entity);
    }

}
