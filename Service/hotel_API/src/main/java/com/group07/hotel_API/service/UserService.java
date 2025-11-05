package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.SetRoleRequest;
import com.group07.hotel_API.dto.request.user.UpdateUserRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> findAll();
    UserResponse findById(int id);
    UserResponse saveUser(UserRequest user);
    //UserResponse update(UserRequest user);
    void delete(int id);
    UserResponse findByEmailOrUsername(String identifier);
    List<UserResponse> findByRole(String roleName);
    UserResponse saveAdmin();
    EmployeeCreateResponse saveEmployee(EmployeeRequest employee);
    UserResponse updateUser(UpdateUserRequest updateUserRequest);
    UserResponse setRole(SetRoleRequest setRoleRequest);
    List<UserResponse> getAllEmployees();

}
