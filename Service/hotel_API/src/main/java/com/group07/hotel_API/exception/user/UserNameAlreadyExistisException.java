package com.group07.hotel_API.exception.user;

public class UserNameAlreadyExistisException extends RuntimeException {
    public UserNameAlreadyExistisException(String message) {
        super(message);
    }
}
