package com.group07.hotel_API.exception.room;

public class RoomNumberAlreadyExistsException extends RuntimeException {
    public RoomNumberAlreadyExistsException(String message) {
        super(message);
    }
}
