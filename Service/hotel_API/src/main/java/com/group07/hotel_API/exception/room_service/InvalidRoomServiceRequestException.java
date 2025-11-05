package com.group07.hotel_API.exception.room_service;

public class InvalidRoomServiceRequestException extends RuntimeException {
    public InvalidRoomServiceRequestException(String message) {
        super(message);
    }
}
