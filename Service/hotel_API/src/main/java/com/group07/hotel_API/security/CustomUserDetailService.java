package com.group07.hotel_API.security;


import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException{
        UserClient userClient = userRepository.findByUsernameOrEmail(usernameOrEmail,usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException(usernameOrEmail));

        Set<GrantedAuthority> grantedAuthorities = Set.of(
                new SimpleGrantedAuthority("ROLE_"+userClient.getRole().getRoleName())
        );

        return new User(userClient.getUsername(),userClient.getPassword(),grantedAuthorities);
    }
}
