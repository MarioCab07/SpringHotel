package com.group07.hotel_API.dto.response.user;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {

    private Integer userId;
    private String fullName;
    private String email;
    private String userName;
    private String phoneNumber;
    private String role;
    private String country;
    private String documentNumber;

}
