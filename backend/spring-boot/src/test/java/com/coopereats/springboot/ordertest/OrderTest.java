package com.coopereats.springboot.ordertest;

import com.coopereats.springboot.order.Order;
import com.coopereats.springboot.order.OrderRepository;
import com.coopereats.springboot.order.OrderService;
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

    @BeforeEach
    @AfterEach
    public void cleanUp() {
        // Clean up the database before and after tests to avoid side effects
        orderRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testAddOrder() {
        // Given
        Order order = new Order();
        order.setUserId(1L);
        order.setPickupTime(LocalDateTime.now());
        order.setPaymentStatus("PAID");
        order.setProducts(new HashMap<>() {{
            put(1L, 2); // Example product ID and quantity
        }});
        order.setTotalPrice(100.0);

        // When
        Order savedOrder = orderService.createOrder(order);

        // Then
        assertThat(savedOrder).isNotNull();
        assertThat(savedOrder.getUserId()).isEqualTo(1L);
        assertThat(savedOrder.getTotalPrice()).isEqualTo(100.0);
        assertThat(savedOrder.getProducts()).containsEntry(1L, 2);
        assertThat(savedOrder.getPaymentStatus()).isEqualTo("PAID");
        // Additional assertions as needed
    }
}
