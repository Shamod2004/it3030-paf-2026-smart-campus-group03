package com.smartcampus.auth.repository;

import com.smartcampus.auth.model.User;
import com.smartcampus.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
