package com.coopereats.springboot.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.coopereats.springboot.cart.CartService;
import com.coopereats.springboot.order.OrderService;
import com.coopereats.springboot.paymentinfo.PaymentInfoService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private final CartService cartService;

    private final PaymentInfoService paymentinfoService;

    private final OrderService orderService;

    @Autowired
    public UserController(UserService userService, CartService cartService, PaymentInfoService paymentinfoService, OrderService orderService) {
        this.userService = userService;
        this.cartService = cartService;
        this.paymentinfoService = paymentinfoService;
        this.orderService = orderService;
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
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
//        try {
//            cartService.deleteCartForReal(id);
//            paymentinfoService.deletePaymentInfo(id);
//            orderService.deleteUserOrders(id);
//            userService.deleteUser(id);
//
//            return ResponseEntity.ok().build();
//        } catch (IllegalStateException e) {
//            System.out.println(e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        } catch (Exception e) {
//            System.out.println("An unexpected error occurred while deleting user with ID: " + id);
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            try {
                cartService.deleteCartForReal(id);
            } catch (Exception e) {
                System.out.println("Failed to delete cart for user with ID: " + id + ". Error: " + e.getMessage());
            }

            try {
                paymentinfoService.deletePaymentInfo(id);
            } catch (Exception e) {
                System.out.println("Failed to delete payment info for user with ID: " + id + ". Error: " + e.getMessage());
            }

            try {
                orderService.deleteUserOrders(id);
            } catch (Exception e) {
                System.out.println("Failed to delete orders for user with ID: " + id + ". Error: " + e.getMessage());
            }

            try {
                userService.deleteUser(id);
            } catch (Exception e) {
                System.out.println("Failed to delete user with ID: " + id + ". Error: " + e.getMessage());
                // If the user itself fails to delete, you may consider this critical and choose to return an error response.
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

            return ResponseEntity.ok().build();
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
