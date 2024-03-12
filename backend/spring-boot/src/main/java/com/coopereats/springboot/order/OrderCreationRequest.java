package com.coopereats.springboot.order;

public class OrderCreationRequest {
    private Long userId;
    private String paymentIntentId;

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
}