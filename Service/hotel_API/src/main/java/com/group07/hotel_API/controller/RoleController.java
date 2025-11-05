package com.group07.hotel_API.controller;


import com.group07.hotel_API.dto.request.role.RoleRequest;
import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.role.RoleResponse;
import com.group07.hotel_API.exception.role.RoleNotFoundException;
import com.group07.hotel_API.service.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/role")
@AllArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getAllRoles(){
        List<RoleResponse> roles = roleService.findAll();
        if(roles.isEmpty()){
            throw new RoleNotFoundException("Roles were not found");
        }
        return buildResponse("Roles found",HttpStatus.OK,roles);

    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> saveRole(RoleRequest role){
        return buildResponse("Role created", HttpStatus.CREATED, roleService.save(role));
    }

    @DeleteMapping("/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> deleteRole(@PathVariable String roleName){
        RoleResponse role = roleService.findByRoleName(roleName);
        roleService.delete(role.getRoleId());
        return buildResponse("Role deleted", HttpStatus.OK, role);
    }

    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data){
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status)
                .body(GeneralResponse.builder()
                        .message(message)
                        .status(status.value())
                        .data(data)
                        .uri(uri)
                        .time(LocalDate.now())
                        .build()
                );
    }





}
