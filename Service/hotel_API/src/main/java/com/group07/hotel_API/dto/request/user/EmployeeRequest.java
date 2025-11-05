package com.group07.hotel_API.dto.request.user;


import com.group07.hotel_API.utils.beans.Adult;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeRequest {
    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 5, message = "Name must be at least 5 characters long")
    private String fullName;

    @NotNull(message = "Email cannot be null")
    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email should be valid with @")
    private String email;

    @NotNull(message = "Document cannot be null")
    @NotEmpty(message = "Document cannot be empty")
    private String documentNumber;

    @NotNull(message = "Country cannot be null")
    @NotEmpty(message = "Country cannot be empty")
    private String country;

    @NotNull(message = "Phone number cannot be null")
    @NotEmpty(message = "Phone number cannot be empty")
    @Pattern(regexp = "^\\+?\\d{8,15}$", message = "Phone number must be between 8 and 15 digits long and can start with a '+'")
    private String phoneNumber;

    @NotNull(message = "BirthDate cannot be null")
    @Past(message = "BirthDate must be a past date")
    @Adult
    private LocalDate birthDate;

}
