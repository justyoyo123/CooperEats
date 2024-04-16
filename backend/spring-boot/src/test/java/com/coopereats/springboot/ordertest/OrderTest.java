package com.coopereats.springboot.ordertest;

import com.coopereats.springboot.order.Order;
import com.coopereats.springboot.order.OrderRepository;
import com.coopereats.springboot.order.OrderService;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class OrderTest {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // Create and save a test user
        testUser = new User();
        testUser.setUserName("testUser");
        testUser.setPassword("password");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("1234567890");
        testUser = userRepository.save(testUser);
    }

    @AfterEach
    public void cleanUp() {
        // Clean up the database before and after tests to avoid side effects
        orderRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testAddOrder() {
        // Given
        Order order = new Order();
        order.setUser(testUser); // Set the test user to the order
        order.setPickupTime(LocalDateTime.now());
        order.setPaymentStatus("PAID");
        order.setProducts(new HashMap<>() {{
            put(1L, 2); // Example product ID and quantity
        }});
        order.setTotalPrice(100.0);

        // When
        Order savedOrder = orderService.createOrder(order, testUser.getUserId()); // Pass the test user's ID

        // Then
        assertThat(savedOrder).isNotNull();
        assertThat(savedOrder.getUser().getUserId()).isEqualTo(testUser.getUserId());
        assertThat(savedOrder.getTotalPrice()).isEqualTo(100.0);
        assertThat(savedOrder.getProducts()).containsEntry(1L, 2);
        assertThat(savedOrder.getPaymentStatus()).isEqualTo("PAID");
    }

    @Test
    public void testOrderGettersAndSetters() {
        // Create and configure an Order instance
        Order order = new Order();
        order.setOrderId(1L);
        order.setUser(testUser);
        LocalDateTime orderDate = LocalDateTime.now();
        order.setOrderDate(orderDate);
        LocalDateTime pickupTime = LocalDateTime.now().plusHours(2);
        order.setPickupTime(pickupTime);
        order.setTotalPrice(250.0);
        order.setPaymentStatus("UNPAID");
        HashMap<Long, Integer> products = new HashMap<>();
        products.put(2L, 3);
        order.setProducts(products);

        // Verify all getters and setters
        assertThat(order.getOrderId()).isEqualTo(1L);
        assertThat(order.getUser()).isEqualTo(testUser);
        assertThat(order.getOrderDate()).isEqualTo(orderDate);
        assertThat(order.getPickupTime()).isEqualTo(pickupTime);
        assertThat(order.getTotalPrice()).isEqualTo(250.0);
        assertThat(order.getPaymentStatus()).isEqualTo("UNPAID");
        assertThat(order.getProducts()).containsEntry(2L, 3);
    }
}