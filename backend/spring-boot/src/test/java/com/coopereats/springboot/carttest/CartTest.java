package com.coopereats.springboot.carttest;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.cart.CartService;
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

    @BeforeEach
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
        cart.setUserId(1L);
        cart.setProducts(new HashMap<>() {{
            put(1L, 3); // Example product ID and quantity
            put(2L, 1); // Another product ID and quantity
        }});

        // When
        Cart savedCart = cartService.createOrUpdateCart(cart);

        // Then
        assertThat(savedCart).isNotNull();
        assertThat(savedCart.getUserId()).isEqualTo(1L);
        assertThat(savedCart.getProducts()).hasSize(2).containsEntry(1L, 3).containsEntry(2L, 1);

        // Retrieve the cart and verify its content
        Cart retrievedCart = cartService.getCartByUserId(1L).orElse(null);
        assertThat(retrievedCart).isNotNull();
        assertThat(retrievedCart.getUserId()).isEqualTo(1L);
        assertThat(retrievedCart.getProducts()).hasSize(2).containsEntry(1L, 3).containsEntry(2L, 1);
    }
}

