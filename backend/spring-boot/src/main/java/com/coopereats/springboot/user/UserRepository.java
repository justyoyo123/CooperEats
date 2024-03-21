package com.coopereats.springboot.user;

import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Long> {
    User findByFirebaseUid(String firebaseuid);
}