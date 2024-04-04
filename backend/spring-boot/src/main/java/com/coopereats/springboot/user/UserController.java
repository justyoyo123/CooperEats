package com.coopereats.springboot.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get a single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a user by ID
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while deleting user with ID: " + id);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // Fetch a user ID by email
    @GetMapping("/findByEmail")
    public ResponseEntity<Long> getUserIdByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(user.getUserId()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get a user ID by Firebase UID
    @GetMapping("/firebase/{firebaseuid}")
    public ResponseEntity<?> getUserByFirebaseUid(@PathVariable String firebaseuid) {
        Long userId = userService.getUserByFirebaseUid(firebaseuid);
        if (userId != null) {
            return ResponseEntity.ok().body(userId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
