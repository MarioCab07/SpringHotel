package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningRequest;
import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningUpdateRequest;
import com.group07.hotel_API.dto.response.room_cleaning.RoomCleaningResponse;
import com.group07.hotel_API.entities.RoomCleaning;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.exception.room_cleaning.RoomCleaningNotFoundException;
import com.group07.hotel_API.exception.user.UserNotFoundException;
import com.group07.hotel_API.repository.RoomCleaningRepository;
import com.group07.hotel_API.repository.RoomRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.RoomCleaningService;
import com.group07.hotel_API.utils.enums.CleaningStatus;
import com.group07.hotel_API.utils.mappers.RoomCleaningMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomCleaningServiceImpl implements RoomCleaningService {
    private final RoomCleaningRepository roomCleaningRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoomCleaningServiceImpl(RoomCleaningRepository roomCleaningRepository, RoomRepository roomRepository, UserRepository userRepository) {
        this.roomCleaningRepository = roomCleaningRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<RoomCleaningResponse> findAll(){
        return RoomCleaningMapper.toDTOList(roomCleaningRepository.findAll());
    }

    @Override
    public RoomCleaningResponse findById(Integer id){
        return RoomCleaningMapper.toDTO(roomCleaningRepository.findById(id)
                .orElseThrow(() -> new RoomCleaningNotFoundException("Room cleaning not found with id " + id)));
    }

    @Override
    public List<RoomCleaningResponse> findByRoomId(Integer roomId){
        List<RoomCleaning> cleanings = roomCleaningRepository.findByRoomId(roomId);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public List<RoomCleaningResponse> findByStatus(CleaningStatus status) {
        List<RoomCleaning> cleanings = roomCleaningRepository.findByStatus(status);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public List<RoomCleaningResponse> findByUserId(Integer userId) {
        List<RoomCleaning> cleanings = roomCleaningRepository.findByUserId(userId);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public List<RoomCleaningResponse> findAllSummaries() {
        List<RoomCleaning> cleanings = roomCleaningRepository.findAllSummaries();
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    @Transactional
    public RoomCleaningResponse create(RoomCleaningRequest request){
        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + request.getUserId()));

        var room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Room not found with ID: " + request.getRoomId()));

        var entity = RoomCleaningMapper.toEntity(request, user, room);
        var saved = roomCleaningRepository.save(entity);
        room.setLastCleanedAt(saved.getCleanedAt());
        roomRepository.save(room);
        return RoomCleaningMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public RoomCleaningResponse update(Integer id, RoomCleaningUpdateRequest request){
        var existing = roomCleaningRepository.findById(id)
                .orElseThrow(() -> new RoomCleaningNotFoundException("Room cleaning not found with ID: " + id));

        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + request.getUserId()));

        var room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Room not found with ID: " + request.getRoomId()));

        var entity = RoomCleaningMapper.toEntityUpdate(id, request, user, room);
        var updated = roomCleaningRepository.save(entity);
        room.setLastCleanedAt(updated.getCleanedAt());
        roomRepository.save(room);
        return RoomCleaningMapper.toDTO(updated);
    }

    @Override
    public void delete(Integer id) {
        RoomCleaning roomCleaning = roomCleaningRepository.findById(id)
                .orElseThrow(() -> new RoomCleaningNotFoundException("Room cleaning not found with ID: " + id));

        roomCleaningRepository.delete(roomCleaning);
    }

}
