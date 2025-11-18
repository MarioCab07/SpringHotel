package com.group07.hotel_API.exception.MaterialRequest;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }
}


