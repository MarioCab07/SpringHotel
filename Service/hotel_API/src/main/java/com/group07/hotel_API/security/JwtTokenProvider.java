package com.group07.hotel_API.security;

import com.group07.hotel_API.entities.UserClient;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String secret;
    @Value("${app.jwt-expiration-time}")
    private String expTime;

    public String generateToken(Authentication auth){
        String username = auth.getName();
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + Long.parseLong(expTime));

        String token = Jwts.builder()
                .subject(username)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getKey())
                .compact();

        return token;
    }

    private Key getKey(){
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
    }

    public String getUsernameFromToken(String token){
        String username = Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        return username;
    }

    public boolean validateToken(String token){
        Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parse(token);
        return true;
    }

    public String generateTokenFromEmail(UserClient user) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + Long.parseLong(expTime));

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role",user.getRole().getRoleName())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getKey())
                .compact();
    }

}
