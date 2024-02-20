package com.coopereats.springboot.paymenttest;

import com.coopereats.springboot.cart.CartService;
import com.coopereats.springboot.order.Order;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.order.OrderService;
import com.coopereats.springboot.user.UserService;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.cart.Cart;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.coopereats.springboot.order.OrderCreationRequest;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class PaymentTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // create test user
        testUser = new User();
        testUser.setUserName("john_doe");
        testUser.setPassword("password");
        testUser.setEmail("john.doe@example.com");
        testUser.setFullName("John Doe");
        testUser.setPhoneNumber("1234567890");
        testUser = userService.createUser(testUser);

        // create test cart
        Cart cartDetails = new Cart();
        Map<Long, Integer> products = new HashMap<>();
        products.put(1L, 3);
        products.put(2L, 2);
        products.put(5L, 1);
        cartDetails.setProducts(products);
        cartDetails.setTotalPrice(120.50);
        cartDetails.setPaymentStatus("PENDING");

        Cart updatedCart = cartService.createOrUpdateCart(cartDetails, testUser.getUserId());
    }

    @AfterEach
    public void tearDown() {
        // Clean up the database
        cartRepository.deleteAll();
        userRepository.deleteAll();

    }

    @Test
    @Transactional
    public void createOrderFromCart_WithValidPayment_ShouldCreateOrder() {
        OrderCreationRequest request = new OrderCreationRequest(testUser.getUserId(), "tok_visa");
        Order resultOrder = orderService.createOrderFromRequest(request.getUserId(), request.getPaymentToken());
        assertThat(resultOrder).isNotNull();
        assertThat(resultOrder.getPaymentStatus()).isEqualTo("PAID");
    }

    @Test
    @Transactional
    public void createOrderFromCart_WithInvalidPayment_ShouldNotCreateOrder() {
        OrderCreationRequest request = new OrderCreationRequest(testUser.getUserId(), "tok_yomama");
        assertThrows(RuntimeException.class, () -> {
            orderService.createOrderFromRequest(request.getUserId(), request.getPaymentToken());
        });
    }
}

