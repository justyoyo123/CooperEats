package com.coopereats.springboot.order;

import java.time.LocalDateTime;

public class OrderCreationRequest {
    private Long userId;
    private String paymentIntentId;

    private LocalDateTime pickupTime;

    public OrderCreationRequest() {}

    public OrderCreationRequest(Long userId, String paymentIntentId) {
        this.userId = userId;
        this.paymentIntentId = paymentIntentId;
    }

    // Constructors, getters, and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPaymentIntentId() { // Changed method name
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) { // Changed method name
        this.paymentIntentId = paymentIntentId;
    }

    public LocalDateTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }
}