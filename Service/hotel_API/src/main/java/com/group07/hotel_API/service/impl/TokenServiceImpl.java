package com.group07.hotel_API.service.impl;


import com.group07.hotel_API.entities.Token;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.token.TokenNotFoundException;
import com.group07.hotel_API.repository.TokenRepository;
import com.group07.hotel_API.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;

    @Override
    public void saveToken(UserClient userClient, String jwt){
        Token token = Token.builder()
                .userClient(userClient)
                .token(jwt)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    @Override
    public void revokeToken(String jwt){
        Token token = tokenRepository.findByToken(jwt).orElseThrow(()-> new TokenNotFoundException("Token not found"));
        token.setRevoked(true);
        tokenRepository.save(token);
    }

    @Override
    public boolean isTokenValid(String jwt){

        return tokenRepository.findByToken(jwt).filter(token -> !token.getRevoked() && token.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }
}
