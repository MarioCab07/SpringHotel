package com.group07.hotel_API.service;

public interface CardValidatorService {

    boolean luhnCheck(String number);

    boolean isValidExpiry(Integer month, Integer year);

    boolean isValidCvv(String cvv);

    String getBrand(String number);

    String last4(String number);
}
