package com.group07.hotel_API.exception.room_type;

public class RoomTypeNotFoundException extends RuntimeException {
    public RoomTypeNotFoundException(String message) {
        super(message);
    }
}
