package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.role.RoleRequest;
import com.group07.hotel_API.dto.response.role.RoleResponse;

import java.util.List;

public interface RoleService {

    List<RoleResponse> findAll();
    RoleResponse save(RoleRequest role);
    void delete(int id);
    RoleResponse findByRoleName(String roleName);


}
