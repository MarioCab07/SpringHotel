package com.group07.hotel_API.exception.Booking;

public class BookingNotFoundException extends RuntimeException {
  public BookingNotFoundException(String message) {
    super(message);
  }
}
