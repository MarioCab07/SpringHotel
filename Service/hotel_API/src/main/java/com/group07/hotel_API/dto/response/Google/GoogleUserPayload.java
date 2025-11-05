package com.group07.hotel_API.dto.response.Google;

import lombok.Data;

@Data
public class GoogleUserPayload {
    private String name;
    private String email;
    private String picture;
    private String givenName;
    private String familyName;
}
