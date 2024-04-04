package com.coopereats.springboot.cart;

import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.food.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

import static java.lang.Math.abs;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    private final FoodService foodService;

    @Autowired
    public CartService(CartRepository cartRepository, UserRepository userRepository, FoodService foodService) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.foodService = foodService;
    }

    private double getProductPrice(Long foodId) {
        Optional<Food> foodOptional = foodService.getFoodById(foodId);
        if (foodOptional.isPresent()) {
            return foodOptional.get().getPrice();
        } else {
            throw new IllegalStateException("Food with ID " + foodId + " does not exist.");
        }
    }

    @Transactional
    public Cart createOrUpdateCart(Long foodId, Integer quantity, Long userId) {
        System.out.println("Attempting to find or create cart for userId=" + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));

        Cart cart = cartRepository.findByUser(user);
        double new_price;
        if (cart == null) {
            System.out.println("No existing cart found. Creating new cart for userId=" + userId);
            cart = new Cart();
            cart.setUser(user);
            cart.setPaymentStatus("PENDING");
            new_price = quantity * getProductPrice(foodId); // Initial price calculation
            cart.setTotalPrice(new_price);
            cart.getProducts().put(foodId, quantity);
        } else {
            System.out.println("Existing cart found. Updating cart for userId=" + userId);
            Map<Long, Integer> products = cart.getProducts();
            // Calculate the new quantity or remove the product
            int newQuantity = products.getOrDefault(foodId, 0) + quantity;
            if (newQuantity <= 0) {
                products.remove(foodId);
                new_price = cart.getTotalPrice() - abs(quantity) * getProductPrice(foodId);
            } else {
                products.put(foodId, newQuantity);
                if (quantity < 0) {
                    new_price = cart.getTotalPrice() - abs(quantity) * getProductPrice(foodId);
                } else {
                    new_price = cart.getTotalPrice() + quantity * getProductPrice(foodId);
                }
            }
            // Ensure new_price is not negative and round to 2 decimal places
            new_price = Math.max(0, new_price);
            BigDecimal bd = BigDecimal.valueOf(new_price);
            bd = bd.setScale(2, RoundingMode.HALF_UP);
            cart.setTotalPrice(bd.doubleValue());

            cart.setProducts(products);
        }

        Cart savedCart = cartRepository.save(cart);
        System.out.println("Cart saved successfully for userId=" + userId + ". Cart ID: " + savedCart.getCartId());
        return savedCart;
    }

    public Cart getCartById(long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Cart with ID " + id + " does not exist."));
    }

    public Cart getCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            throw new IllegalStateException("Cart for user ID " + userId + " does not exist.");
        }
        return cart;
    }

    @Transactional
    public void deleteCart(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        Cart cart = cartRepository.findByUser(user);
        // Clear the cart after creating the order
        cart.clearProducts();
        cart.setPaymentStatus("");
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }
}