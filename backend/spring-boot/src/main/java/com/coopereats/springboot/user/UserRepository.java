package com.coopereats.springboot.user;

import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Method to find a user by email
    Optional<User> findByEmail(String email);
=======
public interface UserRepository extends JpaRepository<User, Long> {
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
}
