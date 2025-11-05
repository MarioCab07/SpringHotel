package com.group07.hotel_API.exception.room_cleaning;

public class InvalidRoomCleaningStatusException extends RuntimeException {
    public InvalidRoomCleaningStatusException(String message) {
        super(message);
    }
}
