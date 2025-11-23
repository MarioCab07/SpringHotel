package com.group07.hotel_API.configuration;

import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.entities.Transmitter;
import com.group07.hotel_API.repository.RoleRepository;
import com.group07.hotel_API.repository.RoomTypeRepository;
import com.group07.hotel_API.repository.TransmitterRepository;
import com.group07.hotel_API.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;
    private final RoomTypeRepository roomTypeRepository;
    private final TransmitterRepository transmitterRepository;
    private final EnterpriseProperties enterpriseProperties;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            createRoleIfNotExists("USER");
            createRoleIfNotExists("EMPLOYEE");
            createRoleIfNotExists("ADMIN");
            createRoleIfNotExists("CLEANING_STAFF");
            createTypesIfNotExists("Suite", "A luxurious suite with a living area", 300.0);
            createTypesIfNotExists("Double Room", "A spacious room for two people", 150.0);
            createTypesIfNotExists("Single Room", "A cozy room for one person", 100.0);
            createEnterpriseIfNotExists(enterpriseProperties);




        };
    }

    private void createRoleIfNotExists(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = Role.builder()
                    .roleName(roleName)
                    .build();
            roleRepository.save(role);
        }
    }

    private void createTypesIfNotExists(String typeName, String desc, double price) {
        if (roomTypeRepository.findByName(typeName).isEmpty()) {
            RoomType roomType = RoomType.builder()
                    .name(typeName)
                    .description(desc)
                    .price(price)
                    .build();
            roomTypeRepository.save(roomType);

        }
    }

    private void createEnterpriseIfNotExists(EnterpriseProperties enterprise) {
        if(transmitterRepository.findByName(enterprise.getName()).isPresent()) return;
        Transmitter transmitter = Transmitter.builder()
                .name(enterprise.getName())
                .email(enterprise.getEmail())
                .nit(enterprise.getNit())
                .lineOfBusiness(enterprise.getLineBusiness())
                .phoneNumber(enterprise.getPhone_number())
                .address(enterprise.getAddress())
                .build();
        transmitterRepository.save(transmitter);


    }




}
