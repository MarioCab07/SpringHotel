package com.group07.hotel_API.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    @Builder.Default
    private String  type = "Bearer";
    private String role;
}
