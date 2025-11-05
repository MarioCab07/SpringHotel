package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeRequest;
import com.group07.hotel_API.dto.request.room_service_type.RoomServiceTypeUpdateRequest;
import com.group07.hotel_API.dto.response.room_service_type.RoomServiceTypeResponse;
import com.group07.hotel_API.entities.RoomServiceType;

import com.group07.hotel_API.exception.room_service_type.RoomServiceTypeNotFoundException;
import com.group07.hotel_API.repository.RoomServiceTypeRepository;
import com.group07.hotel_API.service.RoomServiceTypeService;
import com.group07.hotel_API.utils.mappers.RoomServiceTypeMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceTypeServiceImpl implements RoomServiceTypeService {

    private final RoomServiceTypeRepository roomServiceTypeRepository;

    @Autowired
    public RoomServiceTypeServiceImpl(RoomServiceTypeRepository roomServiceTypeRepository) {
        this.roomServiceTypeRepository = roomServiceTypeRepository;
    }

    @Override
    public List<RoomServiceTypeResponse> findAll() {
        return RoomServiceTypeMapper.toDTOList(roomServiceTypeRepository.findAll());
    }

    @Override
    public RoomServiceTypeResponse findById(Integer id) {
        return RoomServiceTypeMapper.toDTO(roomServiceTypeRepository.findById(id)
                .orElseThrow(() -> new RoomServiceTypeNotFoundException("Room service not found with id " + id)));
    }

    @Override
    @Transactional
    public RoomServiceTypeResponse save(RoomServiceTypeRequest request) {
        var entity = RoomServiceTypeMapper.toEntityCreate(request);
        var saved = roomServiceTypeRepository.save(entity);
        return RoomServiceTypeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public RoomServiceTypeResponse update(Integer id, RoomServiceTypeUpdateRequest request) {
        var existing = roomServiceTypeRepository.findById(id)
                .orElseThrow(() -> new RoomServiceTypeNotFoundException("Service type not found with ID: " + id));

        var entity = RoomServiceTypeMapper.toEntityUpdate(id, request);
        var updated = roomServiceTypeRepository.save(entity);
        return RoomServiceTypeMapper.toDTO(updated);
    }

    @Override
    public void delete(Integer id) {
        RoomServiceType entity = roomServiceTypeRepository.findById(id)
                .orElseThrow(() -> new RoomServiceTypeNotFoundException("Room service not found with id " + id));
        roomServiceTypeRepository.delete(entity);
    }
}
