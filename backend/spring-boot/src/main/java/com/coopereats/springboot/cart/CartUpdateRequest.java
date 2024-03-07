package com.coopereats.springboot.cart;

public class CartUpdateRequest {
    private Long foodId;
    private Integer quantity;

    // Constructors, getters, and setters

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
