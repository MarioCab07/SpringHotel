package com.group07.hotel_API.repository;


import com.group07.hotel_API.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TokenRepository extends JpaRepository<Token, UUID> {

    @Query(nativeQuery = true, value = "SELECT * FROM TOKEN T WHERE T.TOKEN = :token")
    Optional<Token> findByToken(@Param("token") String token);

    @Query("SELECT t FROM Token t WHERE t.userClient.id = :userId AND t.revoked = false AND t.expiresAt > CURRENT_TIMESTAMP")

    List<Token> findAllValidTokenByUser(Integer userId);
}
