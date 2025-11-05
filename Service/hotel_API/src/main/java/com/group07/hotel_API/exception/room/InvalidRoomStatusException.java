package com.group07.hotel_API.exception.room;

public class InvalidRoomStatusException extends RuntimeException {
    public InvalidRoomStatusException(String message) {
        super(message);
    }
}
