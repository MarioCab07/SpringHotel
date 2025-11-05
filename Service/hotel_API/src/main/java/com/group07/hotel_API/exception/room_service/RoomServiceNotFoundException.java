package com.group07.hotel_API.exception.room_service;

public class RoomServiceNotFoundException extends RuntimeException {
    public RoomServiceNotFoundException(String message) {
        super(message);
    }
}
