package com.coopereats.springboot.order;

public class OrderCreationRequest {
    private Long userId;
    private String paymentToken;

    public OrderCreationRequest() {}

    public OrderCreationRequest(Long userId, String paymentToken) {
        this.userId = userId;
        this.paymentToken = paymentToken;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPaymentToken() {
        return paymentToken;
    }

    public void setPaymentToken(String paymentToken) {
        this.paymentToken = paymentToken;
    }
}
