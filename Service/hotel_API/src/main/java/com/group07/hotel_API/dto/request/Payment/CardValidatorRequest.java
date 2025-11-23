package com.group07.hotel_API.dto.request.Payment;


import lombok.Data;

@Data
public class CardValidatorRequest {
    private String cardNumber;
    private Integer month;
    private Integer year;
    private String cvv;
}
