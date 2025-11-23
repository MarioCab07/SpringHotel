package com.group07.hotel_API.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "enterprise")
public class EnterpriseProperties {
    private String name;
    private String address;
    private String email;
    private String phone_number;
    private String lineBusiness;
    private String nit;

}
