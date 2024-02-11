package com.coopereats.springboot.cart;

import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name="CART")
public class Cart {

    @Id
    @Column(name="CART_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cartId;

    @Column(name="USER_ID")
    private long userId;

    @ElementCollection
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyColumn(name = "product_id") // Column for the map key (product ID).
    @Column(name = "quantity") // Column for the map value (quantity of the product).
    private Map<Long, Integer> products = new HashMap<>();


    public long getCartId() {
        return cartId;
    }

    public void setCartId(long cartId) {
        this.cartId = cartId;
    }
    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Map<Long, Integer> getProducts() {
        return products;
    }

    public void setProducts(Map<Long, Integer> products) {
        this.products = products;
    }

}