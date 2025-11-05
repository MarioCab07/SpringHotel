package com.group07.hotel_API.service.impl;


import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.service.BookingService;
import com.group07.hotel_API.dto.request.Booking.BookingRequest;
import com.group07.hotel_API.dto.request.Booking.BookingUpdateRequest;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.exception.Booking.BookingNotFoundException;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.exception.user.UserNotFoundException;
import com.group07.hotel_API.repository.BookingRepository;
import com.group07.hotel_API.repository.RoomRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.utils.enums.BookingStatus;
import com.group07.hotel_API.utils.mappers.BookingMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;


import java.time.LocalDate;
import java.util.List;

@Service

public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    // FIND ALL BOOKINGS
    @Override
    public List<BookingResponse> findAll() {
        return BookingMapper.toDTOList(bookingRepository.findAll());
    }

    // FIND BOOKING BY ID
    @Override
    public BookingResponse findById(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        return BookingMapper.toDTO(booking);
    }

    // SAVE A NEW BOOKING
    @Override
    @Transactional
    public BookingResponse save(BookingRequest request) {
        UserClient user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        Booking booking = BookingMapper.toBookingCreate(request, user, room);
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // UPDATE EXISTING BOOKING
    @Override
    @Transactional
    public BookingResponse update(int id, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (request.getUserId() != null) {
            UserClient user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            booking.setUser(user);
        }

        if (request.getRoomId() != null) {
            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new RoomNotFoundException("Room not found"));
            booking.setRoom(room);
        }

        BookingMapper.updateEntity(booking, request, BookingStatus.valueOf(request.getStatus()));
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // DELETE BOOKING
    @Override
    public void delete(int id) {
        bookingRepository.deleteById(id);
    }

    // GET BOOKINGS BY USER ID
    @Override
    public List<BookingResponse> getUserBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findAllByUserId(userId);
        return BookingMapper.toDTOList(bookings);
    }
    // GET ACTIVE BOOKINGS
    @Override
    public List<BookingResponse> getActiveBookings() {
        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.ACTIVE);
        return BookingMapper.toDTOList(bookings);
    }
    @Override
    public BookingResponse checkIn(int userId) {
        LocalDate today = LocalDate.now();
        Booking booking = bookingRepository
                .findByUserIdAndCheckInAndStatus(userId, today, BookingStatus.PENDING)
                .orElseThrow(() -> new BookingNotFoundException("No hay reservas pendientes para hoy"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return BookingMapper.toDTO(booking);
    }

    @Override
    public BookingResponse checkOut(int userId) {
        LocalDate today = LocalDate.now();
        Booking booking = bookingRepository
                .findByUserIdAndStatus(userId, BookingStatus.CONFIRMED)
                .filter(b -> !b.getCheckOut().isBefore(today))
                .orElseThrow(() -> new BookingNotFoundException("No hay reservas para hacer check-out"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return BookingMapper.toDTO(booking);
    }

    @Override
    public BookingResponse findActiveByRoomId(Integer roomId) {
        LocalDate today = LocalDate.now();
        Booking booking = bookingRepository.findActiveBookingByRoomId(roomId, today)
                .orElseThrow(() -> new BookingNotFoundException("No active bookings found for room ID: " + roomId));
        return BookingMapper.toDTO(booking);
    }

}
