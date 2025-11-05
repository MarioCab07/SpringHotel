package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.configuration.AdminProperties;
import com.group07.hotel_API.dto.request.user.EmployeeRequest;
import com.group07.hotel_API.dto.request.user.SetRoleRequest;
import com.group07.hotel_API.dto.request.user.UpdateUserRequest;
import com.group07.hotel_API.dto.request.user.UserRequest;
import com.group07.hotel_API.dto.response.user.EmployeeCreateResponse;
import com.group07.hotel_API.dto.response.user.UserResponse;
import com.group07.hotel_API.entities.Role;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.role.RoleNotFoundException;
import com.group07.hotel_API.exception.user.EmailAlreadyExistsException;
import com.group07.hotel_API.exception.user.UserNameAlreadyExistisException;
import com.group07.hotel_API.exception.user.UserNotFoundException;
import com.group07.hotel_API.repository.RoleRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.UserService;
import com.group07.hotel_API.utils.mappers.UserMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;

    @Override
    public List<UserResponse> findAll(){
        return UserMapper.toDTOList(userRepository.findAll());
    }

    @Override
    public UserResponse findById(int id){
        return UserMapper.toDTO(userRepository.findById(id).orElseThrow(()-> new UserNotFoundException("User not found")));
    }

    @Override
    public EmployeeCreateResponse saveEmployee(EmployeeRequest employeeRequest){
        Role role = roleRepository.findByRoleName("EMPLOYEE").get();
        UserClient currentUserClient = userRepository.findByEmail(employeeRequest.getEmail());
        if(currentUserClient != null){
            throw new EmailAlreadyExistsException("Email already exists");
        }
        String username = buildUsername(employeeRequest.getFullName());
        String password = generateSecurePassword();
        String hashedPassword = passwordEncoder.encode(password);

        UserRequest userReq = UserRequest.builder()
                .userName(username)
                .password(hashedPassword)
                .documentNumber(employeeRequest.getDocumentNumber())
                .email(employeeRequest.getEmail())
                .fullName(employeeRequest.getFullName())
                .country(employeeRequest.getCountry())
                .phoneNumber(employeeRequest.getPhoneNumber())
                .birthDate(employeeRequest.getBirthDate())
                .build();
        userRepository.save(UserMapper.toUserCreate(userReq,role));
        return UserMapper.toEmployeeCreateDTO(employeeRequest,username,password,role);


    }

    @Override
    public UserResponse updateUser(UpdateUserRequest req){
        UserClient userClient = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (req.getEmail() != null && !req.getEmail().equals(userClient.getEmail())) {
            UserClient existingUser = userRepository.findByEmail(req.getEmail());
            if (existingUser != null) {
                throw new EmailAlreadyExistsException("Email already exists");
            }
            userClient.setEmail(req.getEmail());
        }



        if (req.getFullName() != null) {
            userClient.setName(req.getFullName());
        }

        if (req.getPhoneNumber() != null) {
            userClient.setPhoneNumber(req.getPhoneNumber());
        }

        if (req.getCountry() != null) {
            userClient.setCountry(req.getCountry());
        }

        if (req.getDocumentNumber() != null) {
            userClient.setDocumentNumber(req.getDocumentNumber());
        }

        return UserMapper.toDTO(userRepository.save(userClient));
    }

    @Override
    public UserResponse saveUser(UserRequest user){
        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        UserClient currentUserClient = userRepository.findByEmail(user.getEmail());
        if(currentUserClient != null){
            throw new EmailAlreadyExistsException("Email already exists");
        }
        currentUserClient = userRepository.findByUsername(user.getUserName());
        if(currentUserClient != null){
            throw new UserNameAlreadyExistisException("Username already exists");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        
        return UserMapper.toDTO(userRepository.save(UserMapper.toUserCreate(user,role)));
    }



    @Override
    public void delete(int id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse findByEmailOrUsername(String identifier) {

        UserClient userClient = userRepository.findByUsernameOrEmail(identifier,identifier).orElseThrow(()-> new UserNotFoundException("User not found with identifier: " + identifier));

        return UserMapper.toDTO(userClient);

    }

    @Override
    public List<UserResponse> findByRole (String roleName){
        Role role = roleRepository.findByRoleName(roleName).orElseThrow(()-> new RoleNotFoundException("Role not found"));
         if(role == null){
           throw new RoleNotFoundException("Role not found");
         }


        List<UserClient> userClients = userRepository.findAllByRoleRoleName(role.getRoleName());

        return UserMapper.toDTOList(userClients);

    }

    @Override
    public UserResponse setRole(SetRoleRequest req){
        UserClient userClient = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Role role = roleRepository.findByRoleName(req.getRoleName())
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        userClient.setRole(role);
        userRepository.save(userClient);
        return UserMapper.toDTO(userRepository.save(userClient));
    }

    @Override
    public UserResponse saveAdmin(){
        UserClient existingUser = userRepository.findByUsernameOrEmail(adminProperties.getUserName(), adminProperties.getEmail()).orElse(null);
        if (existingUser != null) {
            throw new UserNameAlreadyExistisException("Admin user already exists with username or email ");
        }
        Role role = roleRepository.findByRoleName("ADMIN")
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));
        UserRequest user =  UserRequest.builder()
                .userName(adminProperties.getUserName())
                .documentNumber(adminProperties.getDocumentNumber())
                .email(adminProperties.getEmail())
                .fullName(adminProperties.getFullName())
                .country(adminProperties.getCountry())
                .phoneNumber(adminProperties.getPhoneNumber())
                .password(adminProperties.getPassword())
                .build();



        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return UserMapper.toDTO(userRepository.save(UserMapper.toUserCreate(user,role)));
    }

    @Override
    public List<UserResponse> getAllEmployees() {
        List<UserClient> employees = userRepository.findEmployeesAndCleaners();
        return UserMapper.toDTOList(employees);
    }

    private String buildUsername(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 0) throw new IllegalArgumentException("Nombre vacío");

        String initials = parts[0].substring(0,1);
        if (parts.length > 3) {
            initials += parts[1].substring(0,1);
        }

        String surname = parts.length >= 2
                ? parts[parts.length-2]
                : parts[0];

        String base   = simplify(initials + surname);

        String candidate = base;
        int i = 1;
        while (userRepository.findByUsername(candidate) !=null) {
            candidate = base + i;
            i++;
        }
        return candidate;
    }

    private String simplify(String s) {
        String normalized = java.text.Normalizer
                .normalize(s, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.replaceAll("[^A-Za-z0-9]", "").toLowerCase();
    }

    private String generateSecurePassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        SecureRandom r = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) sb.append(chars.charAt(r.nextInt(chars.length())));
        return sb.toString();
    }


}
