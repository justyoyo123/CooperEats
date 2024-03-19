package com.coopereats.springboot.user;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.order.Order;
import jakarta.transaction.Transactional;
import com.coopereats.springboot.order.OrderRepository;
import com.coopereats.springboot.cart.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    private final OrderRepository orderRepository;

    @Autowired
    public UserService(UserRepository userRepository, CartRepository cartRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    // Method to add a new user and define if admin or regular user
    public User createUser(User user) {
        if ("frankie@cooper.edu".equals(user.getEmail())) {
            user.setRole(User.Role.ADMIN);
        } else {
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

    // Method to find a user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Method to update a user
    @Transactional
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

    @Transactional
    // Method to delete a user
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User with ID " + id + " does not exist."));
        Cart cart = cartRepository.findByUser(user);
        List<Order> orders = orderRepository.findByUserUserId(id);
        cartRepository.deleteById(cart.getCartId());
        for (Order order : orders) {
            orderRepository.deleteById(order.getOrderId());
        }
        userRepository.deleteById(id);
    }

    public Long getUserByFirebaseUid(String firebaseuid) {
        User user = userRepository.findByFirebaseUid(firebaseuid);
        if (user != null) {
            return user.getUserId();
        } else {
            System.out.println("NOOOOO");
            return null; // or throw new CustomNotFoundException("User not found for Firebase UID: " + firebaseuid);
        }
    }

}