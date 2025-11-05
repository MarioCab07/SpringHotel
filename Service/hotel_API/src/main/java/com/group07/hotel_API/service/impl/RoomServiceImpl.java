package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room.RoomRequest;
import com.group07.hotel_API.dto.request.room.RoomUpdateRequest;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.exception.room.InvalidRoomStatusException;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.exception.room.RoomNumberAlreadyExistsException;
import com.group07.hotel_API.repository.RoomRepository;
import com.group07.hotel_API.service.RoomService;
import com.group07.hotel_API.service.RoomTypeService;
import com.group07.hotel_API.utils.enums.RoomStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.group07.hotel_API.utils.mappers.RoomMapper;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomTypeService roomTypeService;

    @Autowired
    public RoomServiceImpl(RoomRepository repository, RoomTypeService roomTypeService) {
        this.roomRepository = repository;
        this.roomTypeService = roomTypeService;
    }

    @Override
    public List<RoomResponse> findAll() {
        return RoomMapper.toDTOList(roomRepository.findAll());
    }

    @Override
    public RoomResponse findById (Integer id){
        return RoomMapper.toDTO(roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id "+ id)));
    }

    @Override
    @Transactional
    public RoomResponse save(RoomRequest roomDTO){
        if (roomRepository.existsByRoomNumber(roomDTO.getRoomNumber())) {
            throw new RoomNumberAlreadyExistsException("Room number already exists: " + roomDTO.getRoomNumber());
        }
        RoomType roomType = roomTypeService.findById(roomDTO.getRoomType());

        return RoomMapper.toDTO(roomRepository.save(RoomMapper.toEntityCreate(roomDTO, roomType)));
    }

    @Override
    @Transactional
    public RoomResponse update(Integer id, RoomUpdateRequest roomDTO){
        var existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        if(!existingRoom.getRoomNumber().equals(roomDTO.getRoomNumber()) && roomRepository.existsByRoomNumber(roomDTO.getRoomNumber())){
            throw new RoomNumberAlreadyExistsException("Room number already exists: " + roomDTO.getRoomNumber());
        }

        RoomType roomType = roomTypeService.findById(roomDTO.getRoomType());
        var updatedRoom = RoomMapper.toEntityUpdate(id, roomDTO, roomType);
        var saved = roomRepository.save(updatedRoom);
        return RoomMapper.toDTO(saved);
    }

    @Override
    public List<RoomResponse> findByStatus(String status) {
        RoomStatus roomStatus = RoomStatus.fromString(status)
                .orElseThrow(() -> new InvalidRoomStatusException(status)); // Personalizada

        List<Room> rooms = roomRepository.findByStatus(roomStatus);

        if (rooms.isEmpty()) {
            throw new RoomNotFoundException("No rooms found with status: " + status);
        }

        return RoomMapper.toDTOList(rooms);
    }

    @Override
    public List<RoomResponse> getAvailableRooms() {
        List<Room> availableRooms = roomRepository.findByStatus(RoomStatus.AVAILABLE);

        if (availableRooms.isEmpty()) {
            throw new RoomNotFoundException("No available rooms found.");
        }

        return RoomMapper.toDTOList(availableRooms);
    }

    @Override
    public List<RoomResponse> findByType(Integer TypeId){
        List<Room> rooms = roomRepository.findByRoomType_Id(TypeId);

        if (rooms.isEmpty()) {
            throw new RoomNotFoundException("No rooms found with type ID: " + TypeId);
        }
        return RoomMapper.toDTOList(rooms);
    }

    public void delete(Integer id) {
        roomRepository.deleteById(id);
    }
}
