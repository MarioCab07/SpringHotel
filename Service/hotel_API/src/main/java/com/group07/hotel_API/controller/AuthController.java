package com.group07.hotel_API.controller;


import com.group07.hotel_API.dto.request.LoginRequest;
import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.SetRoleRequest;
import com.group07.hotel_API.dto.request.user.UpdateUserRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.TokenResponse;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.token.TokenNotFoundException;
import com.group07.hotel_API.service.AuthService;
import com.group07.hotel_API.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {


    private final AuthService authService;

    @PostMapping("/register/user")
    public ResponseEntity<GeneralResponse> registerUser(@RequestBody @Valid UserRequest userRequest){

        UserResponse user = authService.register(userRequest);

        return buildResponse("User registered successfully", HttpStatus.OK, user);

    }

    @PostMapping("/register/admin")
    public ResponseEntity<GeneralResponse> registerAdmin(){

        UserResponse user = authService.adminRegister();

        return buildResponse("Admin registered successfully", HttpStatus.OK, null);

    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest){
        String token = authService.login(loginRequest);
        UserResponse user = authService.getUserDetails(token);
        TokenResponse.builder().accessToken(token).build();
        return ResponseEntity.ok(TokenResponse.builder().accessToken(token).role(user.getRole()).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<GeneralResponse> logOut(HttpServletRequest request){
        String token = getTokenFromRequest(request);
        if(token ==null){
            throw new TokenNotFoundException("Token not found in request");
        }

        authService.logout(token);

        return buildResponse("User logged out successfully", HttpStatus.OK, null);

    }

    @PostMapping("/set/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> setRole(@RequestBody @Valid SetRoleRequest req){
        UserResponse user = authService.setRole(req);
        return buildResponse("Role set successfully", HttpStatus.OK, user);
    }

    @GetMapping("/get/user/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CLEANING_STAFF', 'USER')")
    public ResponseEntity<GeneralResponse> getUserDetails(HttpServletRequest request){
        String token = getTokenFromRequest(request);
        if(token == null){
            throw new TokenNotFoundException("Token not found in request");
        }
        UserResponse user = authService.getUserDetails(token);
        return buildResponse("User details retrieved successfully", HttpStatus.OK, user);
    }

    @GetMapping("get/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getUserById(@PathVariable String id){
        UserResponse user = authService.getUserById(Integer.parseInt(id));
        return buildResponse("User details retrieved successfully", HttpStatus.OK, user);
    }

    @PutMapping("/update/user")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<GeneralResponse> updateUser(@RequestBody @Valid UpdateUserRequest req){
        UserResponse user = authService.updateUser(req);
        return buildResponse("User updated successfully", HttpStatus.OK, user);
    }

    @GetMapping("/getAll/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getAllUsers(){
        return buildResponse("Users retrieved successfully", HttpStatus.OK, authService.getAllUsers());
    }

    @GetMapping("/get/users/role/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getUsersByRole(@PathVariable String roleName){
        return buildResponse("Users with role " + roleName + " retrieved successfully", HttpStatus.OK, authService.getUsersByRole(roleName));
    }

    @PostMapping("/register/employee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> registerEmployee(@RequestBody @Valid EmployeeRequest req){
        EmployeeCreateResponse user = authService.employeeRegister(req);
        return buildResponse("Employee registered successfully", HttpStatus.CREATED, user);
    }

    @GetMapping("/get/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getAllEmployees() {
        return buildResponse("Employees retrieved successfully", HttpStatus.OK, authService.getAllEmployees());
    }




    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        GeneralResponse response = GeneralResponse.builder()
                .uri(uri)
                .message(message)
                .status(status.value())
                .data(data)
                .build();
        return ResponseEntity.status(status).body(response);
    }

    private String getTokenFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken !=null && bearerToken.startsWith("Bearer")){
            return bearerToken.substring(7,bearerToken.length());
        }
        return null;
    }



}
