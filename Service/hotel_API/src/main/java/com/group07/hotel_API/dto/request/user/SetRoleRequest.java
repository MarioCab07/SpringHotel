package com.group07.hotel_API.dto.request.user;


import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SetRoleRequest {
    @NotNull
    private Integer userId;
    @NotNull
    private String roleName;

}
