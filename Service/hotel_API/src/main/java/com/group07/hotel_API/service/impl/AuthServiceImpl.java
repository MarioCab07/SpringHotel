package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.LoginRequest;
import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.SetRoleRequest;
import com.group07.hotel_API.dto.request.user.UpdateUserRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;
import com.group07.hotel_API.entities.Token;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.repository.TokenRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.security.JwtTokenProvider;
import com.group07.hotel_API.service.AuthService;
import com.group07.hotel_API.service.TokenService;
import com.group07.hotel_API.service.UserService;
import com.group07.hotel_API.utils.mappers.UserMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    AuthenticationManager authenticationManager;
    JwtTokenProvider jwtTokenProvider;
    TokenService tokenService;
    UserRepository userRepository;
    UserService userService;

    @Override
    public UserResponse register(UserRequest req){
        return userService.saveUser(req);
    }

    @Override
    public UserResponse setRole(SetRoleRequest req) {
        return userService.setRole(req);
    }
    @Override
    public UserResponse adminRegister(){
        return userService.saveAdmin();
    }

    @Override
    public UserResponse getUserDetails(String jwt) {
        String username = jwtTokenProvider.getUsernameFromToken(jwt);
        UserClient user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + username));
        return UserMapper.toDTO(user);
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest req){
        return userService.updateUser(req);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userService.findAll();
    }


    @Override
    public EmployeeCreateResponse employeeRegister(EmployeeRequest req) {
        return userService.saveEmployee(req);
    }

    @Override
    public List<UserResponse> getUsersByRole(String roleName) {
        return userService.findByRole(roleName);
    }

    @Override
    public UserResponse getUserById(Integer id) {
        return userService.findById(id);
    }

    @Override
    public List<UserResponse> getAllEmployees() {
        return userService.getAllEmployees();
    }





    @Override
    public String login(LoginRequest loginRequest){
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtTokenProvider.generateToken(auth);
        UserClient user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(),loginRequest.getUsername()).orElseThrow(()-> new UsernameNotFoundException("User not found with username or email: " + loginRequest.getUsername()));
        tokenService.saveToken(user,token);


        return token;
    }

    @Override
    public String logout(String jwt){
        tokenService.revokeToken(jwt);
        return "Token revoked successfully";
    }
}
