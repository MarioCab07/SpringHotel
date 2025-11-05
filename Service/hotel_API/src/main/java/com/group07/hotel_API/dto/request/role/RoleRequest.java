package com.group07.hotel_API.dto.request.role;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleRequest {
    @NotNull(message = "Role name cannot be null")
    @NotEmpty(message = "Role name cannot be empty")
    private String roleName;
}
