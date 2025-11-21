package com.group07.hotel_API.service.impl;


import com.group07.hotel_API.dto.request.Booking.BookingModifyRequest;
import com.group07.hotel_API.dto.response.Booking.BookingServiceItemResponse;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.repository.RoomServiceRepository;
import com.group07.hotel_API.repository.RoomServiceTypeRepository;
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
import com.group07.hotel_API.utils.enums.RoomStatus;
import com.group07.hotel_API.utils.mappers.BookingMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final EmailService  emailService;
    private final RoomServiceRepository roomServiceRepository;
    private final com.group07.hotel_API.service.TicketService ticketService;
    private final com.group07.hotel_API.repository.TicketRepository ticketRepository;
    private final com.group07.hotel_API.repository.RoomServiceTypeRepository roomServiceTypeRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);
    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository, EmailService emailService, RoomServiceRepository roomServiceRepository, com.group07.hotel_API.service.TicketService ticketService, com.group07.hotel_API.repository.TicketRepository ticketRepository, com.group07.hotel_API.repository.RoomServiceTypeRepository roomServiceTypeRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.roomServiceRepository = roomServiceRepository;
        this.ticketService = ticketService;
        this.ticketRepository = ticketRepository;
        this.roomServiceTypeRepository = roomServiceTypeRepository;
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

        // No permitir cancelar si ya está cancelada
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("This booking is already cancelled");
        }

        // No permitir cancelar si ya pasó o es el día del check-in
        LocalDate today = LocalDate.now();
        if (!today.isBefore(booking.getCheckIn())) {
            throw new RuntimeException("Cannot cancel a booking on or after the check-in date");
        }

        // 1️⃣ Cambiar estado de la reserva
        booking.setStatus(BookingStatus.CANCELLED);

        // 2️⃣ Cambiar estado de la habitación a AVAILABLE
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);

        // 3️⃣ Guardar reserva cancelada
        Booking saved = bookingRepository.save(booking);

        // 4️⃣ Enviar correo de cancelación
        String body =
                "Dear " + booking.getUser().getName() + ",\n\n" +
                        "We would like to inform you that your reservation with ID " + id + " has been cancelled.\n" +
                        "This cancellation has been processed in accordance with our booking policies and the details originally provided at the time of reservation.\n\n" +
                        "If you believe this cancellation was made in error or if you require assistance with making a new reservation, please do not hesitate to contact us. We will be happy to assist you.\n\n" +
                        "Thank you for choosing our services.\n\n" +
                        "Kind regards,\n" +
                        "Lume Hotel & Suites";

        emailService.sendSimpleEmail(
                booking.getUser().getEmail(),
                "Cancellation Confirmation – Reservation ID " + booking.getId(),
                body
        );

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

    // GET BOOKING HISTORY WITH SERVICES AND TICKETS
    @Override
    public List<com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse> getBookingHistory(Integer userId) {
        // Obtener todas las reservas del usuario
        List<Booking> bookings = bookingRepository.findAllByUserId(userId);
        
        return bookings.stream().map(booking -> {
            // Obtener servicios adicionales de la reserva
            List<BookingServiceItemResponse> services = bookingRepository.findServicesByBooking(booking.getId());
            
            // Obtener ticket/factura asociada (puede ser null)
            com.group07.hotel_API.dto.response.Ticket.TicketResponse ticket = null;
            try {
                var ticketOptional = ticketRepository.findByBookingId(booking.getId());
                if (ticketOptional.isPresent()) {
                    ticket = com.group07.hotel_API.utils.mappers.TicketMapper.toDTO(ticketOptional.get());
                }
            } catch (Exception e) {
                // Si no hay ticket, continuar sin él
            }
            
            // Calcular total pagado
            Double totalPaid = null;
            if (ticket != null && ticket.getTotal() != null) {
                totalPaid = ticket.getTotal().doubleValue();
            }
            
            // Construir respuesta
            BookingResponse bookingResponse = BookingMapper.toDTO(booking);
            return com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse.builder()
                    .id(bookingResponse.getId())
                    .checkIn(bookingResponse.getCheckIn())
                    .checkOut(bookingResponse.getCheckOut())
                    .status(bookingResponse.getStatus())
                    .userId(bookingResponse.getUserId())
                    .userName(bookingResponse.getUserName())
                    .userEmail(bookingResponse.getUserEmail())
                    .roomId(bookingResponse.getRoomId())
                    .roomNumber(bookingResponse.getRoomNumber())
                    .roomType(bookingResponse.getRoomType())
                    .roomStatus(bookingResponse.getRoomStatus())
                    .services(services)
                    .ticket(ticket)
                    .totalPaid(totalPaid)
                    .build();
        }).collect(java.util.stream.Collectors.toList());
    }

    // GET ALL BOOKING HISTORY (ADMIN ONLY)
    @Override
    public List<com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse> getAllBookingHistory() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        return allBookings.stream().map(booking -> {
            List<BookingServiceItemResponse> services = bookingRepository.findServicesByBooking(booking.getId());
            
            com.group07.hotel_API.dto.response.Ticket.TicketResponse ticket = null;
            try {
                var ticketOptional = ticketRepository.findByBookingId(booking.getId());
                if (ticketOptional.isPresent()) {
                    ticket = com.group07.hotel_API.utils.mappers.TicketMapper.toDTO(ticketOptional.get());
                }
            } catch (Exception e) {
                // Si no hay ticket, continuar sin él
            }
            
            Double totalPaid = null;
            if (ticket != null && ticket.getTotal() != null) {
                totalPaid = ticket.getTotal().doubleValue();
            }
            
            BookingResponse bookingResponse = BookingMapper.toDTO(booking);
            return com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse.builder()
                    .id(bookingResponse.getId())
                    .checkIn(bookingResponse.getCheckIn())
                    .checkOut(bookingResponse.getCheckOut())
                    .status(bookingResponse.getStatus())
                    .userId(bookingResponse.getUserId())
                    .userName(bookingResponse.getUserName())
                    .userEmail(bookingResponse.getUserEmail())
                    .roomId(bookingResponse.getRoomId())
                    .roomNumber(bookingResponse.getRoomNumber())
                    .roomType(bookingResponse.getRoomType())
                    .roomStatus(bookingResponse.getRoomStatus())
                    .services(services)
                    .ticket(ticket)
                    .totalPaid(totalPaid)
                    .build();
        }).collect(java.util.stream.Collectors.toList());
    }

    // UPDATE BOOKING HISTORY (ADMIN ONLY)
    @Override
    @Transactional
    public com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse updateBookingHistory(
            Integer bookingId, 
            com.group07.hotel_API.dto.request.Booking.BookingHistoryUpdateRequest request) {
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        
        // Actualizar servicios si se proporcionan
        if (request.getServiceTypeIds() != null && !request.getServiceTypeIds().isEmpty()) {
            // Obtener servicios existentes de la reserva
            List<com.group07.hotel_API.entities.RoomService> existingServices = 
                    roomServiceRepository.findByBookingId(bookingId);
            
            // Eliminar servicios existentes
            for (com.group07.hotel_API.entities.RoomService service : existingServices) {
                roomServiceRepository.delete(service);
            }
            
            // Crear nuevo servicio con los tipos especificados
            Set<com.group07.hotel_API.entities.RoomServiceType> serviceTypes = 
                    new HashSet<>(roomServiceTypeRepository.findAllById(request.getServiceTypeIds()));
            
            if (serviceTypes.size() == request.getServiceTypeIds().size()) {
                com.group07.hotel_API.entities.RoomService newService = 
                        com.group07.hotel_API.entities.RoomService.builder()
                                .booking(booking)
                                .serviceTypes(serviceTypes)
                                .status(com.group07.hotel_API.utils.enums.ServiceStatus.PENDING)
                                .requestedAt(java.time.LocalDateTime.now())
                                .build();
                roomServiceRepository.save(newService);
            }
        }
        
        // Recalcular factura si se solicita
        if (request.getRecalculateInvoice() != null && request.getRecalculateInvoice()) {
            recalculateInvoice(bookingId);
        }
        
        // Retornar historial actualizado construyendo la respuesta directamente
        List<BookingServiceItemResponse> updatedServices = bookingRepository.findServicesByBooking(bookingId);
        
        com.group07.hotel_API.dto.response.Ticket.TicketResponse ticket = null;
        try {
            var ticketOptional = ticketRepository.findByBookingId(bookingId);
            if (ticketOptional.isPresent()) {
                ticket = com.group07.hotel_API.utils.mappers.TicketMapper.toDTO(ticketOptional.get());
            }
        } catch (Exception e) {
            // Si no hay ticket, continuar sin él
        }
        
        Double totalPaid = null;
        if (ticket != null && ticket.getTotal() != null) {
            totalPaid = ticket.getTotal().doubleValue();
        }
        
        BookingResponse bookingResponse = BookingMapper.toDTO(booking);
        return com.group07.hotel_API.dto.response.Booking.BookingHistoryResponse.builder()
                .id(bookingResponse.getId())
                .checkIn(bookingResponse.getCheckIn())
                .checkOut(bookingResponse.getCheckOut())
                .status(bookingResponse.getStatus())
                .userId(bookingResponse.getUserId())
                .userName(bookingResponse.getUserName())
                .userEmail(bookingResponse.getUserEmail())
                .roomId(bookingResponse.getRoomId())
                .roomNumber(bookingResponse.getRoomNumber())
                .roomType(bookingResponse.getRoomType())
                .roomStatus(bookingResponse.getRoomStatus())
                .services(updatedServices)
                .ticket(ticket)
                .totalPaid(totalPaid)
                .build();
    }

    // DELETE BOOKING HISTORY RECORD (ADMIN ONLY)
    @Override
    @Transactional
    public void deleteBookingHistoryRecord(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        
        // Eliminar servicios asociados
        List<com.group07.hotel_API.entities.RoomService> services = 
                roomServiceRepository.findByBookingId(bookingId);
        for (com.group07.hotel_API.entities.RoomService service : services) {
            roomServiceRepository.delete(service);
        }
        
        // Eliminar ticket si existe
        try {
            var ticketOptional = ticketRepository.findByBookingId(bookingId);
            if (ticketOptional.isPresent()) {
                ticketRepository.delete(ticketOptional.get());
            }
        } catch (Exception e) {
            // Continuar si no hay ticket
        }
        
        // Eliminar la reserva
        bookingRepository.delete(booking);
    }

    // RECALCULATE INVOICE (ADMIN ONLY)
    @Override
    @Transactional
    public com.group07.hotel_API.dto.response.Ticket.TicketResponse recalculateInvoice(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        
        Room room = booking.getRoom();
        
        // Calcular subtotal de habitación
        long nights = java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        nights = Math.max(1, nights);
        java.math.BigDecimal roomSubtotal = java.math.BigDecimal.valueOf(room.getRoomType().getPrice() * nights);
        
        // Calcular subtotal de servicios
        List<BookingServiceItemResponse> services = bookingRepository.findServicesByBooking(bookingId);
        java.math.BigDecimal servicesSubtotal = services.stream()
                .map(s -> java.math.BigDecimal.valueOf(s.getPrice()))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        // Calcular IVA (10% sobre servicios)
        java.math.BigDecimal iva = servicesSubtotal.multiply(java.math.BigDecimal.valueOf(0.10));
        
        // Calcular total
        java.math.BigDecimal total = roomSubtotal.add(servicesSubtotal).add(iva);
        
        // Buscar ticket existente o crear uno nuevo
        var ticketOptional = ticketRepository.findByBookingId(bookingId);
        com.group07.hotel_API.entities.Ticket ticket;
        
        if (ticketOptional.isPresent()) {
            ticket = ticketOptional.get();
            ticket.setSubtotalRoom(roomSubtotal);
            ticket.setSubtotalServices(servicesSubtotal);
            ticket.setIva(iva);
            ticket.setTotal(total);
            ticket.setIssuedAt(java.time.LocalDateTime.now());
        } else {
            ticket = com.group07.hotel_API.entities.Ticket.builder()
                    .booking(booking)
                    .subtotalRoom(roomSubtotal)
                    .subtotalServices(servicesSubtotal)
                    .iva(iva)
                    .total(total)
                    .issuedAt(java.time.LocalDateTime.now())
                    .status("ACTIVE")
                    .build();
        }
        
        return com.group07.hotel_API.utils.mappers.TicketMapper.toDTO(ticketRepository.save(ticket));
    }

}
