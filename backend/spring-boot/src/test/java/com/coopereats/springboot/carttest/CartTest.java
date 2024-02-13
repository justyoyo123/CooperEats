package com.coopereats.springboot.carttest;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.cart.CartService;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CartTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    @BeforeEach
    public void setup() {
        // Clean up the database before tests to avoid side effects
        cartRepository.deleteAll();
        userRepository.deleteAll();

        // Create and save a test user
        testUser = new User();
        testUser.setUserName("TestUser");
        testUser.setPassword("password");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("1234567890");
        testUser = userRepository.save(testUser);
    }

    @AfterEach
    public void cleanUp() {
        // Clean up the database before and after tests to avoid side effects
        cartRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testCreateAndRetrieveCart() {
        // Given
        Cart cart = new Cart();
        cart.setUser(testUser); // Set the user to the cart
        cart.setProducts(new HashMap<>() {{
            put(1L, 3); // Example product ID and quantity
            put(2L, 1); // Another product ID and quantity
        }});

        // When
        Cart savedCart = cartService.createCart(cart, testUser.getUserId());

        // Then
        assertThat(savedCart).isNotNull();
        assertThat(savedCart.getUser().getUserId()).isEqualTo(testUser.getUserId());
        assertThat(savedCart.getProducts()).hasSize(2).containsEntry(1L, 3).containsEntry(2L, 1);

        // Retrieve the cart and verify its content
        Cart retrievedCart = cartService.getCartByUser(testUser.getUserId());
        assertThat(retrievedCart).isNotNull();
        assertThat(retrievedCart.getUser().getUserId()).isEqualTo(testUser.getUserId());
        assertThat(retrievedCart.getProducts()).hasSize(2).containsEntry(1L, 3).containsEntry(2L, 1);
    }
}

