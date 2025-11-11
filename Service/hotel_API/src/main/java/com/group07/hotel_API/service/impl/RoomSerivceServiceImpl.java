package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.room_service.RoomServiceRequest;
import com.group07.hotel_API.dto.request.room_service.RoomServiceUpdateRequest;
import com.group07.hotel_API.dto.response.room_service.RoomServiceResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.RoomService;
import com.group07.hotel_API.entities.RoomServiceType;
import com.group07.hotel_API.exception.Booking.BookingNotFoundException;
import com.group07.hotel_API.exception.room_service.InvalidRoomServiceRequestException;
import com.group07.hotel_API.exception.room_service.RoomServiceNotFoundException;
import com.group07.hotel_API.exception.room_service_type.RoomServiceTypeNotFoundException;
import com.group07.hotel_API.repository.BookingRepository;
import com.group07.hotel_API.repository.RoomServiceRepository;
import com.group07.hotel_API.repository.RoomServiceTypeRepository;
import com.group07.hotel_API.service.RoomServiceService;
import com.group07.hotel_API.service.RoomServiceTypeService;
import com.group07.hotel_API.utils.enums.ServiceStatus;
import com.group07.hotel_API.utils.mappers.RoomServiceMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoomSerivceServiceImpl implements RoomServiceService {

    private final RoomServiceRepository roomServiceRepository;
    private final BookingRepository bookingRepository;
    private final RoomServiceTypeRepository roomServiceTypeRepository;

    @Autowired
    public RoomSerivceServiceImpl(RoomServiceRepository roomServiceRepository, BookingRepository bookingRepository, RoomServiceTypeRepository roomServiceTypeRepository) {
        this.roomServiceRepository = roomServiceRepository;
        this.bookingRepository = bookingRepository;
        this.roomServiceTypeRepository = roomServiceTypeRepository;
    }

    @Override
    public List<RoomServiceResponse> findAll(){
        return RoomServiceMapper.toDTOList(roomServiceRepository.findAll());
    }

    @Override
    public RoomServiceResponse findById(Integer id) {
        return RoomServiceMapper.toDTO(roomServiceRepository.findById(id)
                .orElseThrow(() -> new RoomServiceNotFoundException("Room service not found with id " + id)));
    }

    @Override
    public List<RoomServiceResponse> findByBookingId(Integer bookingId) {
        return RoomServiceMapper.toDTOList(roomServiceRepository.findByBookingId(bookingId));
    }

    @Override
    public List<RoomServiceResponse> findByStatus(ServiceStatus status) {
        return RoomServiceMapper.toDTOList(roomServiceRepository.findByStatus(status));
    }

    @Override
    @Transactional
    public RoomServiceResponse save(RoomServiceRequest dto) {
        LocalDate today = LocalDate.now();

        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getCheckOut().isBefore(today)) {
            throw new InvalidRoomServiceRequestException("Cannot request room service for a past booking.");
        }

        Set<RoomServiceType> serviceTypes = new HashSet<>(roomServiceTypeRepository.findAllById(dto.getServiceTypeIds()));

        if (serviceTypes.size() != dto.getServiceTypeIds().size()) {
            throw new RoomServiceTypeNotFoundException("One or more service types not found");
        }

        RoomService roomService = RoomServiceMapper.toEntityCreate(dto, booking, serviceTypes);
        var saved = roomServiceRepository.save(roomService);

        return RoomServiceMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public RoomServiceResponse update(Integer id, RoomServiceUpdateRequest dto) {
        RoomService existing = roomServiceRepository.findById(id)
                .orElseThrow(() -> new RoomServiceNotFoundException("Room service not found with ID: " + id));

        existing.setStatus(ServiceStatus.fromString(dto.getRoomServiceStatus().toUpperCase())
                .orElseThrow(() -> new InvalidRoomServiceRequestException(dto.getRoomServiceStatus())));

        Set<RoomServiceType> serviceTypes = new HashSet<>(roomServiceTypeRepository.findAllById(dto.getServiceTypeIds()));
        if (serviceTypes.size() != dto.getServiceTypeIds().size()) {
            throw new RoomServiceTypeNotFoundException("One or more service types not found");
        }

        existing.setServiceTypes(serviceTypes);

        var updated = roomServiceRepository.save(existing);
        return RoomServiceMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        RoomService entity = roomServiceRepository.findById(id)
                .orElseThrow(() -> new RoomServiceNotFoundException("Room service not found with id " + id));
        roomServiceRepository.delete(entity);
    }
}