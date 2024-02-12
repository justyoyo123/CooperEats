package com.coopereats.springboot.order;

import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
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
}
