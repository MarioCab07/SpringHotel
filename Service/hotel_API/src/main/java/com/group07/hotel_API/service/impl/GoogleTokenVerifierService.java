package com.group07.hotel_API.service.impl;

import com.google.api.client.auth.openidconnect.IdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.Collections;
@Service
@AllArgsConstructor
public class GoogleTokenVerifierService {
    private static final String CLIENT_ID = "37913004901-oivf9svfmvuv02slrm7udsvd6tv792b2.apps.googleusercontent.com";

    public IdToken.Payload verifyToken(String idTokenString){
        try{
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if(idToken !=null){
                return idToken.getPayload();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return null;
    }
}
