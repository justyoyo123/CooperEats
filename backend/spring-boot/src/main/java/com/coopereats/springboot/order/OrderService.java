package com.coopereats.springboot.order;

import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.paymentsystem.PaymentProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order createOrder(Order order, Long userId) {
        // Fetch User entity and set it to the order before saving
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        order.setUser(user); // Set the user to the order
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(long orderId, Order updatedOrderDetails) {
        // Check if the order exists before updating
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Order with ID " + orderId + " does not exist."));
        // Update the order details
        existingOrder.setOrderDate(updatedOrderDetails.getOrderDate());
        existingOrder.setPickupTime(updatedOrderDetails.getPickupTime());
        existingOrder.setTotalPrice(updatedOrderDetails.getTotalPrice());
        existingOrder.setPaymentStatus(updatedOrderDetails.getPaymentStatus());
        existingOrder.setProducts(updatedOrderDetails.getProducts());
        return orderRepository.save(existingOrder);
    }

    public Optional<Order> findOrderById(long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public void deleteOrder(long orderId) {
        // Check if the order exists before attempting to delete
        boolean exists = orderRepository.existsById(orderId);
        if (!exists) {
            throw new IllegalStateException("Order with ID " + orderId + " does not exist.");
        }
        orderRepository.deleteById(orderId);
    }

    // Method to get user's order history by user ID
    public List<Order> getUserOrderHistory(Long userId) {
        System.out.print("HERE");
        return orderRepository.findByUserUserId(userId);
    }


    @Transactional
    public Order createOrderFromRequest(Long userId, String paymentIntentId, LocalDateTime pickUpTime) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        Cart cart = cartRepository.findByUser(user);

        // Proceed to create the order as payment was successful
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        if (pickUpTime != null) {
            order.setPickupTime(pickUpTime);
        } else {
            order.setPickupTime(LocalDateTime.now());
        }
        order.setTotalPrice(cart.getTotalPrice());
        order.setPaymentStatus("PAID");
        order.setProducts(new HashMap<>(cart.getProducts()));
        order.setUser(user);

        // Save the order
        Order savedOrder = orderRepository.save(order);

        // Clear the cart after creating the order
        cart.clearProducts();
        cart.setPaymentStatus("");
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);

        return savedOrder;
    }

    @Transactional
    public Order fulfillOrder(long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Order with ID " + orderId + " does not exist."));
        order.setFullfillmentStatus(true);
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteUserOrders(Long userId) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists) {
            throw new IllegalStateException("User with ID " + userId + " does not exist.");
        }

        // Find all orders for the user
        List<Order> orders = orderRepository.findByUserUserId(userId);

        // Delete all orders
        for (Order order : orders) {
            orderRepository.deleteById(order.getOrderId());
        }
    }
}