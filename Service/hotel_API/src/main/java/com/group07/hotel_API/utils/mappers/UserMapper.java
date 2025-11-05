package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;
import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.entities.UserClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public class UserMapper {
    public static UserClient toUserCreate(UserRequest userDTO, Role role){
        return UserClient.builder()
                .name(userDTO.getFullName())
                .username(userDTO.getUserName())
                .email(userDTO.getEmail())
                .country(userDTO.getCountry())
                .documentNumber(userDTO.getDocumentNumber())
                .password(userDTO.getPassword())
                .phoneNumber(userDTO.getPhoneNumber())
                .role(role)
                .birthDate(userDTO.getBirthDate())
                .build();
    }

    //Implement toUserUpdate method if needed

    public static UserResponse toDTO(UserClient userClient){
        return UserResponse.builder()
                .userId(Math.toIntExact(userClient.getId()))
                .fullName(userClient.getName())
                .userName(userClient.getUsername())
                .email(userClient.getEmail())
                .phoneNumber(userClient.getPhoneNumber())
                .role(userClient.getRole().getRoleName())
                .country(userClient.getCountry())
                .documentNumber(userClient.getDocumentNumber())
                .build();
    }

    public static EmployeeCreateResponse toEmployeeCreateDTO(EmployeeRequest req, String username, String password, Role role) {
        return EmployeeCreateResponse.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .userName(username)
                .generatedPassword(password)
                .role(role.getRoleName())
                .country(req.getCountry())
                .documentNumber(req.getDocumentNumber())
                .phoneNumber(req.getPhoneNumber())
                .build();
    }

    public static List<UserResponse> toDTOList(List<UserClient> userClients){
        return userClients.stream()
                .map(UserMapper::toDTO)
                .toList();
    }
}
