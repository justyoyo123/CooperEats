package com.coopereats.springboot.wishlist;


public class WishlistUpdateRequest {
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
