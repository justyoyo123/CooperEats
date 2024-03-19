package com.coopereats.springboot.user;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
=======
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Method to add a new user and define if admin or regular user
    public User createUser(User user) {
        if ("frankie@cooper.edu".equals(user.getEmail())) {
            user.setRole(User.Role.ADMIN);
<<<<<<< HEAD
        } else {
=======
        }
        else {
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
            user.setRole(User.Role.USER);
        }
        return userRepository.save(user);
    }

    // Method to get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to find a user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

<<<<<<< HEAD
    // Method to find a user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

=======
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
    // Method to update a user
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
        user.setUserName(userDetails.getUserName());
        user.setPassword(userDetails.getPassword());
        user.setEmail(userDetails.getEmail());
        user.setFullName(userDetails.getFullName());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        return userRepository.save(user);
    }

    // Method to delete a user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
