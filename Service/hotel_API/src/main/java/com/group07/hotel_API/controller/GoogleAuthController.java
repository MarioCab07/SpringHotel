package com.group07.hotel_API.controller;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.group07.hotel_API.dto.response.Google.GoogleUserPayload;
import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.role.RoleNotFoundException;
import com.group07.hotel_API.repository.RoleRepository;
import com.group07.hotel_API.repository.TokenRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.security.JwtTokenProvider;
import com.group07.hotel_API.service.RoleService;
import com.group07.hotel_API.service.TokenService;
import com.group07.hotel_API.service.UserService;
import com.group07.hotel_API.service.factory.GoogleUserFactory;
import com.group07.hotel_API.service.impl.GoogleTokenVerifierService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {
    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final RoleRepository roleRepository;

    @Autowired
    private GoogleUserFactory googleUserFactory;

    public GoogleAuthController(GoogleTokenVerifierService googleTokenVerifierService, JwtTokenProvider jwtTokenProvider, UserService userService, UserRepository userRepository, TokenService tokenService, RoleRepository roleRepository) {
        this.googleTokenVerifierService = googleTokenVerifierService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.roleRepository = roleRepository;

    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("token");

        GoogleIdToken.Payload payload = (GoogleIdToken.Payload) googleTokenVerifierService.verifyToken(idTokenString);

        if (payload == null) {
            return ResponseEntity.status(401).body("Token de Google inválido");
        }
        Role defaultRole = roleRepository.findByRoleName("USER").orElseThrow(
                ()-> new RoleNotFoundException("Default role not found")
        );

        String email = payload.getEmail();
        String fullName = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        String givenName = (String) payload.get("given_name");
        String familyName = (String) payload.get("family_name");

        GoogleUserPayload googleUserPayload = new GoogleUserPayload();
        googleUserPayload.setEmail(email);
        googleUserPayload.setName(fullName);
        googleUserPayload.setPicture(picture);
        googleUserPayload.setGivenName(givenName);
        googleUserPayload.setFamilyName(familyName);



        // Buscar si ya existe
        UserClient user = userRepository.findByUsernameOrEmail(email,email).orElseGet(()->{
            return googleUserFactory.createFromGoogle(googleUserPayload,defaultRole);
        });

        // Generar JWT propio
        String jwt = jwtTokenProvider.generateTokenFromEmail(user);
        tokenService.saveToken(user,jwt);

        return ResponseEntity.ok(Map.of(
                "jwt", jwt,
                "email", email,
                "name", fullName,
                "role", defaultRole.getRoleName()

        ));
    }

    private String getTokenFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken !=null && bearerToken.startsWith("Bearer")){
            return bearerToken.substring(7,bearerToken.length());
        }
        return null;
    }

}


