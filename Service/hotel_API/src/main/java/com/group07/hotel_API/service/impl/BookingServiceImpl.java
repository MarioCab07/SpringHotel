package com.group07.hotel_API.service.impl;


import com.group07.hotel_API.dto.request.Booking.BookingModifyRequest;
import com.group07.hotel_API.dto.response.Booking.BookingServiceItemResponse;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.repository.RoomServiceRepository;
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
import com.group07.hotel_API.service.EmailService;
import com.group07.hotel_API.utils.enums.BookingStatus;
import com.group07.hotel_API.utils.mappers.BookingMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final EmailService  emailService;
  private final RoomServiceRepository roomServiceRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);
    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository, EmailService emailService,RoomServiceRepository roomServiceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
      this.roomServiceRepository=roomServiceRepository;
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
        System.out.println(booking);
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // UPDATE EXISTING BOOKING
    @Override
    @Transactional
    public BookingResponse update(int id, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        LocalDate pastCheckIn = booking.getCheckIn();
        LocalDate pastCheckOut = booking.getCheckOut();

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
        BookingResponse newBooking = BookingMapper.toDTO(bookingRepository.save(booking));
        emailService.sendSimpleEmail(booking.getUser().getEmail(),"There has been an update to the booking",bookingToString(newBooking, pastCheckIn, pastCheckOut));

        return newBooking;
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

    @Override
    public BookingResponse findPendingBookingById(int id) {
        Booking booking = bookingRepository
                .findByIdAndStatus(id, BookingStatus.PENDING)
                .orElseThrow(() -> new BookingNotFoundException("No pending booking found with this ID"));

        return BookingMapper.toDTO(booking);
    }

    // CANCEL BOOKING
    @Override
    @Transactional
    public BookingResponse cancel(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("This booking is already cancelled");
        }

        LocalDate today = LocalDate.now();
        if (!today.isBefore(booking.getCheckIn())) {
            throw new RuntimeException("Cannot cancel a booking on or after the check-in date");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        String body =
                "Dear " + booking.getUser().getName() + ",\n\n" +
                        "We would like to inform you that your reservation with ID " + id + " has been cancelled.\n" +
                        "This cancellation has been processed in accordance with our booking policies and the details originally provided at the time of reservation.\n\n" +
                        "If you believe this cancellation was made in error or if you require assistance with making a new reservation, please do not hesitate to contact us. We will be happy to assist you.\n\n" +
                        "Thank you for choosing our services.\n\n" +
                        "Kind regards,\n" +
                        "Lume Hotel & Suites";

        Booking saved = bookingRepository.save(booking);
        emailService.sendSimpleEmail(booking.getUser().getEmail(),"Cancellation Confirmation – Reservation ID "+booking.getId(),body);

        return BookingMapper.toDTO(saved);
    }
    @Override
    public List<BookingServiceItemResponse> getServicesForBooking(Integer bookingId) {
        return bookingRepository.findServicesByBooking(bookingId);
    }


    //MODIFY BOOKING BY USER
    @Override
    @Transactional
    public BookingResponse modify(int id, BookingModifyRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        LocalDate pastCheckIn = booking.getCheckIn();
        LocalDate pastCheckOut = booking.getCheckOut();

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be modified");
        }

        LocalDate today = LocalDate.now();
        if (!today.isBefore(booking.getCheckIn())) {
            throw new RuntimeException("Cannot modify a booking on or after the check-in date");
        }

        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RuntimeException("Both check-in and check-out are required");
        }

        LocalDate newCheckIn = LocalDate.parse(request.getCheckIn());
        LocalDate newCheckOut = LocalDate.parse(request.getCheckOut());

        if (!newCheckOut.isAfter(newCheckIn)) {
            throw new RuntimeException("Check-out must be after check-in");
        }

        booking.setCheckIn(newCheckIn);
        booking.setCheckOut(newCheckOut);

        Booking saved = bookingRepository.save(booking);
        emailService.sendSimpleEmail(booking.getUser().getEmail(),"There has been an update to the booking – Reservation ID "+booking.getId(),bookingToString(BookingMapper.toDTO(saved),pastCheckIn,pastCheckOut));
        return BookingMapper.toDTO(saved);
    }

    private String bookingToString(BookingResponse actualBooking,LocalDate pastCheckIn, LocalDate pastCheckOut) {
        return "This email is to inform you that your reservation with ID: "+ actualBooking.getId() +" has been updated.\n\n" +
                "The check-in date has changed from "+ pastCheckIn.format(formatter) +" to " + actualBooking.getCheckIn().format(formatter) +" and the check-out date has changed from "+ pastCheckOut.format(formatter)+" to "+actualBooking.getCheckOut().format(formatter);
    }




}
