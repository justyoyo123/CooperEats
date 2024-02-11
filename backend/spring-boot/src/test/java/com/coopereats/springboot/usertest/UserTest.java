package com.coopereats.springboot.usertest;

import com.coopereats.springboot.users.Users;
import com.coopereats.springboot.users.UserService;
import com.coopereats.springboot.users.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    @AfterEach
    public void cleanUp() {
        // Clean up the database before and after tests to avoid side effects
        userRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testAddUser() {
        // Given
        Users user = new Users();
        user.setUserName("john_doe");
        user.setPassword("password");
        user.setEmail("john.doe@example.com");
        user.setFullName("John Doe");
        user.setPhoneNumber("1234567890");

        // When
        Users savedUser = userService.createUser(user);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getUserName()).isEqualTo("john_doe");
        assertThat(savedUser.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(savedUser.getFullName()).isEqualTo("John Doe");
        assertThat(savedUser.getPhoneNumber()).isEqualTo("1234567890");
    }
}
