package com.coopereats.springboot.food;

import com.coopereats.springboot.cart.Cart;
import java.util.HashSet;
import java.util.Set;

import com.coopereats.springboot.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "FOOD")
public class Food {

    public enum Category {
        APPETIZER,
        MAIN_COURSE,
        DESSERT,
        DRINK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FOOD_ID")
    private long foodId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "PRICE")
    private double price;

    @Column(name = "IMAGE")
    private String image;

    @Column(name = "QUANTITY")
    private int quantity;
    
    @ManyToMany(mappedBy = "foods")
    private Set<Cart> carts = new HashSet<>();

    @Column(name = "CATEGORY")
    @Enumerated(EnumType.STRING)
    private Food.Category Category;

    // Constructors, Getters, and Setters
    public Food() {
    }

    public long getFoodId() {
        return foodId;
    }

    public void setFoodId(long foodId) {
        this.foodId = foodId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    public Set<Cart> getCarts() {
        return carts;
    }

    public void setCarts(Set<Cart> carts) {
        this.carts = carts;
    }

    public Food.Category getCategory() {
        return Category;
    }

    public void setCategory(Food.Category Category) {
        this.Category = Category;
    }
}
