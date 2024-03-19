package com.coopereats.springboot.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Method to find a user by email
    Optional<User> findByEmail(String email);

    // Method to find a user by Firebase UID
    User findByFirebaseUid(String firebaseuid);
}
