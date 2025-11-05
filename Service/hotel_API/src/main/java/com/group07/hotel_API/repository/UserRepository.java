package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.UserClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserClient,Integer> {
    Optional<UserClient> findByUsernameOrEmail(String username, String email);
    UserClient findByUsername(String username);
    UserClient findByEmail(String email);
    List<UserClient> findAllByRoleRoleName(String roleName);
    @Query("""
      SELECT u
        FROM UserClient u
        JOIN u.role r
       WHERE r.roleName IN ('EMPLOYEE','CLEANING_STAFF')
    """)
    List<UserClient> findEmployeesAndCleaners();





}
