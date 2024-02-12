package com.coopereats.springboot.cart;

import com.coopereats.springboot.user.User;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "CART")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CART_ID")
    private long cartId;

    @OneToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;

    @ElementCollection
    @CollectionTable(name = "cart_items", joinColumns = @JoinColumn(name = "cart_id"))
    @MapKeyColumn(name = "product_id") // Column for the map key (product ID).
    @Column(name = "quantity") // Column for the map value (quantity of the product).
    private Map<Long, Integer> products = new HashMap<>();

    public long getCartId() {
        return cartId;
    }

    public void setCartId(long cartId) {
        this.cartId = cartId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Map<Long, Integer> getProducts() {
        return products;
    }

    public void setProducts(Map<Long, Integer> products) {
        this.products = products;
    }
}
