package com.group07.hotel_API.configuration;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "admin")
public class AdminProperties {
    private String fullName;
    private String country;
    private String documentNumber;
    private String phoneNumber;
    private String email;
    private String userName;
    private String password;
}
