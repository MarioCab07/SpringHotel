package com.group07.hotel_API.utils.mappers;


import com.group07.hotel_API.dto.request.Booking.BookingRequest;
import com.group07.hotel_API.dto.request.Booking.BookingUpdateRequest;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;
import com.group07.hotel_API.entities.Booking;
import com.group07.hotel_API.entities.Room;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.utils.enums.BookingStatus;

import java.util.List;

public class BookingMapper {
    public static Booking toBookingCreate(BookingRequest request, UserClient user, Room room) {
    return Booking.builder()
            .checkIn(request.getCheckIn())
            .checkOut(request.getCheckOut())
            .status(BookingStatus.PENDING)
            .user(user)
            .room(room)
            .build();
}
    public static void updateEntity(Booking booking, BookingUpdateRequest request, BookingStatus status) {
        if (request.getCheckIn() != null) booking.setCheckIn(request.getCheckIn());
        if (request.getCheckOut() != null) booking.setCheckOut(request.getCheckOut());
        if (request.getStatus() != null) booking.setStatus(status);
    }


    public static BookingResponse toDTO(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .status(booking.getStatus().toString())
                .userId(booking.getUser().getId())
                .roomId(booking.getRoom().getId())
                .build();
    }

    public static List<BookingResponse> toDTOList(List<Booking> bookings) {
        return bookings.stream()
                .map(BookingMapper::toDTO)
                .toList();
    }
}
