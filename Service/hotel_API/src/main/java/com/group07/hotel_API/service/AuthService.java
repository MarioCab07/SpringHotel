package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.LoginRequest;
import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.SetRoleRequest;
import com.group07.hotel_API.dto.request.user.UpdateUserRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;

import java.util.List;

public interface AuthService {
    String login(LoginRequest loginRequest);
    String logout(String jwt);
    UserResponse register(UserRequest userRequest);
    UserResponse adminRegister();
    UserResponse getUserDetails(String jwt);
    UserResponse updateUser(UpdateUserRequest updateUserRequest);
    List<UserResponse> getAllUsers();
    List<UserResponse> getUsersByRole(String roleName);
    EmployeeCreateResponse employeeRegister(EmployeeRequest employeeRequest);
    UserResponse setRole(SetRoleRequest setRoleRequest);
    UserResponse getUserById(Integer id);
    List<UserResponse> getAllEmployees();

}
