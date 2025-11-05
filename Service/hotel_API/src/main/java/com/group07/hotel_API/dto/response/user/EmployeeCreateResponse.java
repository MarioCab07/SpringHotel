package com.group07.hotel_API.dto.response.user;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeCreateResponse {
    private String fullName;
    private String email;
    private String userName;
    private String phoneNumber;
    private String role;
    private String country;
    private String documentNumber;
    private String generatedPassword;

}
