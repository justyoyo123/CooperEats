package com.coopereats.springboot.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order createOrder(Order order) {
        // Additional logic before saving could be added here
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(long orderId, Order updatedOrder) {
        // Check if the order exists before updating
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Order with ID " + orderId + " does not exist."));
        // Update fields
        order.setUserId(updatedOrder.getUserId());
        order.setOrderDate(updatedOrder.getOrderDate());
        order.setPickupTime(updatedOrder.getPickupTime());
        order.setTotalPrice(updatedOrder.getTotalPrice());
        order.setPaymentStatus(updatedOrder.getPaymentStatus());
        order.setProducts(updatedOrder.getProducts());
        return orderRepository.save(order);
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
