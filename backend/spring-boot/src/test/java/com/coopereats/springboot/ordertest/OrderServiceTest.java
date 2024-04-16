package com.coopereats.springboot.ordertest;

import com.coopereats.springboot.order.Order;
import com.coopereats.springboot.order.OrderRepository;
import com.coopereats.springboot.order.OrderService;
import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateOrder() {
        // Setup
        User user = new User();
        user.setUserId(1L);
        Order order = new Order();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Execute
        Order createdOrder = orderService.createOrder(new Order(), 1L);

        // Verify
        verify(userRepository).findById(1L);
        verify(orderRepository).save(any(Order.class));
        assertNotNull(createdOrder);
        assertEquals(user, createdOrder.getUser());
    }

    @Test
    void testUpdateOrder() {
        // Setup
        Order existingOrder = new Order();
        existingOrder.setOrderId(1L);
        existingOrder.setTotalPrice(100.0);
        Order updatedDetails = new Order();
        updatedDetails.setTotalPrice(150.0);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(existingOrder));
        when(orderRepository.save(existingOrder)).thenReturn(existingOrder);

        // Execute
        Order updatedOrder = orderService.updateOrder(1L, updatedDetails);

        // Verify
        verify(orderRepository).findById(1L);
        verify(orderRepository).save(existingOrder);
        assertEquals(150.0, updatedOrder.getTotalPrice());
    }

    @Test
    void testCreateOrderFromCart() {
        // Setup
        User user = new User();
        user.setUserId(1L);
        Cart cart = new Cart();
        cart.setTotalPrice(200.0);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(cart);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute
        Order newOrder = orderService.createOrderFromCart(1L);

        // Verify
        verify(cartRepository).save(cart);
        assertEquals(200.0, newOrder.getTotalPrice());
        assertEquals("PAID", newOrder.getPaymentStatus());
        assertTrue(cart.getProducts().isEmpty());
        assertEquals(0.0, cart.getTotalPrice());
    }

    @Test
    void testDeleteOrder() {
        // Setup
        when(orderRepository.existsById(1L)).thenReturn(true);

        // Execute
        orderService.deleteOrder(1L);

        // Verify
        verify(orderRepository).deleteById(1L);
    }

    @Test
    void testDeleteOrder_NotFound() {
        // Setup
        when(orderRepository.existsById(1L)).thenReturn(false);

        // Execute & Verify
        assertThrows(IllegalStateException.class, () -> orderService.deleteOrder(1L));
    }
}
