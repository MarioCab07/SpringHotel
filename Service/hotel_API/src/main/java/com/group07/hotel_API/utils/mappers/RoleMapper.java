package com.group07.hotel_API.utils.mappers;

import com.group07.hotel_API.dto.request.role.RoleRequest;
import com.group07.hotel_API.dto.response.role.RoleResponse;
import com.group07.hotel_API.entities.Role;

import java.util.List;

public class RoleMapper {

    public static Role toEntity(RoleRequest role){
        return Role.builder()
                .roleName(role.getRoleName())
                .build();
    }

    public static RoleResponse toDTO(Role role){
        return RoleResponse.builder()
                .roleId(role.getId())
                .roleName(role.getRoleName())
                .build();
    }

    public static List<RoleResponse> toDTOList(List<Role> roles){
        return roles.stream()
                .map(RoleMapper::toDTO)
                .toList();
    }
}
