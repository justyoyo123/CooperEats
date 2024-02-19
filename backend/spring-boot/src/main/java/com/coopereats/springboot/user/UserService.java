package com.coopereats.springboot.user;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.coopereats.springboot.exceptions.CustomException;
import com.coopereats.springboot.dto.user.*;
@Service
public class UserService {

    //private final UserRepository userRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Method to add a new user and define if admin or regular user
    public User createUser(User user) {
        if ("frankie@cooper.edu".equals(user.getEmail())) {
            user.setRole(User.Role.ADMIN);
        }
        else {
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

    public SignUpResponseDto signUp(SignupDto signupDto)  throws CustomException {
        // Check to see if the current email address has already been registered.
        if (Objects.nonNull(userRepository.findByEmail(signupDto.getEmail()))) {
            // If the email address has been registered then throw an exception.
            throw new CustomException("User already exists");
        }
        // first encrypt the password
        String encryptedPassword = signupDto.getPassword();
        try {
            encryptedPassword = hashPassword(signupDto.getPassword());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }


        User user = new User(signupDto.getFirstName(), signupDto.getLastName(), signupDto.getEmail(), encryptedPassword );
        try {
            // save the User
            userRepository.save(user);
            // success in creating
            return new SignUpResponseDto("success", "user created successfully");
        } catch (Exception e) {
            // handle signup error
            throw new CustomException(e.getMessage());
        }
    }

    String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(password.getBytes());
        byte[] digest = md.digest();
        StringBuilder hexString = new StringBuilder();
        for (byte b : digest) {
            String hex = Integer.toHexString(0xff & b);
            if(hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString().toUpperCase();
    }
}
