package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.role.RoleRequest;
import com.group07.hotel_API.dto.response.role.RoleResponse;
import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.exception.role.RoleAlreadyExistsException;
import com.group07.hotel_API.exception.role.RoleNotFoundException;
import com.group07.hotel_API.repository.RoleRepository;
import com.group07.hotel_API.service.RoleService;
import com.group07.hotel_API.utils.mappers.RoleMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponse> findAll(){
        return RoleMapper.toDTOList(roleRepository.findAll());
    }

    @Override
    public RoleResponse save(RoleRequest role){
        Optional<Role> existingRole = roleRepository.findByRoleName(role.getRoleName());
        if (existingRole.isPresent()) {
            throw new RoleAlreadyExistsException("Role with name " + role.getRoleName() + " already exists.");
        }
        return RoleMapper.toDTO(roleRepository.save(RoleMapper.toEntity(role)));
    }

    @Override
    public RoleResponse findByRoleName(String roleName){
        Role role = roleRepository.findByRoleName(roleName).orElseThrow(()-> new RoleNotFoundException("Role with name " + roleName + " not found."));

        return RoleMapper.toDTO(role);
    }

    @Override
    public void delete(int id){
        roleRepository.deleteById(id);
    }



}
