package com.group07.hotel_API.service.factory;


import com.group07.hotel_API.dto.response.Google.GoogleUserPayload;
import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.entities.UserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GoogleUserFactory {

    public UserClient createFromGoogle(GoogleUserPayload payload, Role defaultRole){
        UserClient user = new UserClient();

        user.setName(payload.getName());
        user.setEmail(payload.getEmail());
        user.setUsername(generateUsername(payload.getEmail()));
        user.setCountry(null);
        user.setDocumentNumber(UUID.randomUUID().toString());
        user.setPassword(UUID.randomUUID().toString());
        user.setPhoneNumber(null);
        user.setBirthDate(null);
        user.setRole(defaultRole);

        return user;
    }

    private String generateUsername(String email){
        if(email==null) return "user_"+System.currentTimeMillis();
        return email.split("@")[0];
    }


}
