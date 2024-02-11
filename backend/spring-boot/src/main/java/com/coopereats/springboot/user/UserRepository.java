package com.coopereats.springboot.users;

import com.coopereats.springboot.users.Users;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<Users, Long> {
}
