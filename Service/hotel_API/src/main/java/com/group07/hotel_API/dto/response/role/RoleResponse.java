package com.group07.hotel_API.dto.response.role;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
    private Integer roleId;
    private String roleName;
}
