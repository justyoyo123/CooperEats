package com.coopereats.springboot.carttest;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.food.Food;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CartTests {

    @Test
    public void testCartOperations() {
        Cart cart = new Cart();
        Food pizza = new Food();
        pizza.setFoodId(1L);
        Food burger = new Food();
        burger.setFoodId(2L);

        // Test adding foods
        cart.addFood(pizza);
        cart.addFood(burger);
        assertThat(cart.getFoods()).hasSize(2).contains(pizza, burger);

        // Test removing foods
        cart.removeFood(pizza);
        assertThat(cart.getFoods()).hasSize(1).contains(burger);

        // Test cart clear products functionality
        cart.getProducts().put(1L, 3); // Add 3 pizzas
        cart.getProducts().put(2L, 2); // Add 2 burgers
        cart.clearProducts();
        assertThat(cart.getProducts()).isEmpty();
    }
}
