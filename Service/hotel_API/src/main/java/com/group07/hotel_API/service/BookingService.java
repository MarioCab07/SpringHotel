package com.group07.hotel_API.service;



import com.group07.hotel_API.dto.request.Booking.BookingRequest;
import com.group07.hotel_API.dto.request.Booking.BookingUpdateRequest;
import com.group07.hotel_API.dto.response.Booking.BookingResponse;

import java.util.List;

public interface BookingService {
    List<BookingResponse> findAll();
    BookingResponse findById(int id);
    BookingResponse save(BookingRequest booking);
    BookingResponse update(int id, BookingUpdateRequest booking);
    void delete(int id);
    List<BookingResponse> getUserBookings(Integer userId);
    List<BookingResponse> getActiveBookings();
    BookingResponse findActiveByRoomId(Integer roomId);
    BookingResponse checkIn(int userId);
    BookingResponse checkOut(int userId);

}
