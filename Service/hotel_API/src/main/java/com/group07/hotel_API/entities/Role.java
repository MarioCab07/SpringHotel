package com.group07.hotel_API.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;

import java.util.Objects;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "roles", schema = "public")
public class Role {
        public Role(String roleName){
            this.roleName=roleName;
        }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "role_name")
    private String roleName;

    @ManyToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private Set<UserClient> userClients = new HashSet<>();

    @Override
    public boolean equals(Object o){
        if(this == o ) return true;
        if(!(o instanceof Role)) return false;
        Role role = (Role) o;
        return Objects.equals(roleName,role.roleName);
    }

    @Override
    public int hashCode(){
        return Objects.hash(roleName);
    }
}
