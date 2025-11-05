package com.group07.hotel_API.service;

import com.group07.hotel_API.entities.UserClient;

public interface TokenService {
    void saveToken(UserClient userClient, String jwt);
    void revokeToken(String jwt);
    boolean isTokenValid(String jwt);
}
