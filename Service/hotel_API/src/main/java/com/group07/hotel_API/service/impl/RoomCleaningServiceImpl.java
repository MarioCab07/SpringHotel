package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningRequest;
import com.group07.hotel_API.dto.request.room_cleaning.RoomCleaningUpdateRequest;
import com.group07.hotel_API.dto.response.room.RoomResponse;
import com.group07.hotel_API.dto.response.room_cleaning.RoomCleaningResponse;
import com.group07.hotel_API.entities.RoomCleaning;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.exception.room_cleaning.RoomCleaningNotFoundException;
import com.group07.hotel_API.exception.user.UserNotFoundException;
import com.group07.hotel_API.repository.BookingRepository;
import com.group07.hotel_API.repository.RoomCleaningRepository;
import com.group07.hotel_API.repository.RoomRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.RoomCleaningService;
import com.group07.hotel_API.utils.enums.CleaningStatus;
import com.group07.hotel_API.utils.enums.ShiftStatus;
import com.group07.hotel_API.utils.mappers.RoomCleaningMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RoomCleaningServiceImpl implements RoomCleaningService {

    private final RoomCleaningRepository roomCleaningRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public RoomCleaningServiceImpl(RoomCleaningRepository roomCleaningRepository, RoomRepository roomRepository, UserRepository userRepository, BookingRepository bookingRepository) {
        this.roomCleaningRepository = roomCleaningRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
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
        List<RoomCleaning> cleanings = roomCleaningRepository.findByRoom_Id(roomId);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public List<RoomCleaningResponse> findByStatus(CleaningStatus status) {
        List<RoomCleaning> cleanings = roomCleaningRepository.findByStatus(status);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public List<RoomCleaningResponse> findByUserId(Integer userId) {
        List<RoomCleaning> cleanings = roomCleaningRepository.findByUser_Id(userId);
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

        var booking = (request.getBookingId() != null)
                ? bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + request.getBookingId()))
                : null;

        var entity = RoomCleaningMapper.toEntity(request, user, room, booking);
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

        var booking = (request.getBookingId() != null)
                ? bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + request.getBookingId()))
                : null;

        var entity = RoomCleaningMapper.toEntityUpdate(id, request, user, room, booking);
        var updated = roomCleaningRepository.save(entity);
        room.setLastCleanedAt(updated.getCleanedAt());
        roomRepository.save(room);
        return RoomCleaningMapper.toDTO(updated);
    }

    @Override
    public List<RoomResponse> getRoomsWithActiveCheckIn() {

        LocalDate today = LocalDate.now();

        var bookings = bookingRepository.findRoomsWithCheckInActive(today);

        return bookings.stream()
                .map(b -> RoomResponse.builder()
                        .roomId(b.getRoom().getId())
                        .roomNumber(b.getRoom().getRoomNumber())
                        .roomStatus(b.getRoom().getStatus().name())
                        .roomType(b.getRoom().getRoomType())
                        .lastClean(
                                b.getRoom().getLastCleanedAt() != null
                                        ? b.getRoom().getLastCleanedAt().toString()
                                        : null
                        )
                        .build())
                .toList();
    }

    @Override
    public List<RoomResponse> getRoomsWithCheckOutDone() {

        LocalDate today = LocalDate.now();

        var bookings = bookingRepository.findRoomsWithCheckOutDone(today);

        return bookings.stream()
                .map(b -> RoomResponse.builder()
                        .roomId(b.getRoom().getId())
                        .roomNumber(b.getRoom().getRoomNumber())
                        .roomStatus("PENDING_CLEANING")
                        .roomType(b.getRoom().getRoomType())
                        .lastClean(
                                b.getRoom().getLastCleanedAt() != null
                                        ? b.getRoom().getLastCleanedAt().toString()
                                        : null
                        )
                        .build()
                ).toList();
    }

    @Override
    public String sendShiftNotification() {
        LocalTime now = LocalTime.now();

        return (now.isAfter(LocalTime.of(6,0)) && now.isBefore(LocalTime.of(18, 0)))
                ? "MORNING"
                : "EVENING";
    }

    @Override
    public List<RoomCleaningResponse> findByShift(ShiftStatus shift) {
        List<RoomCleaning> cleanings = roomCleaningRepository.findByShift(shift);
        return RoomCleaningMapper.toDTOList(cleanings);
    }

    @Override
    public void delete(Integer id) {
        RoomCleaning roomCleaning = roomCleaningRepository.findById(id)
                .orElseThrow(() -> new RoomCleaningNotFoundException("Room cleaning not found with ID: " + id));

        roomCleaningRepository.delete(roomCleaning);
    }

}
