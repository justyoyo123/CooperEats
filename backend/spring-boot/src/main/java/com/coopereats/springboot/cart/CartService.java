package com.coopereats.springboot.cart;

import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }
    @Transactional
    public Cart createOrUpdateCart(Cart cartDetails, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));

        // Attempt to find an existing cart for the user
        Optional<Cart> existingCartOpt = Optional.ofNullable(cartRepository.findByUser(user));

        Cart cart;
        if (existingCartOpt.isPresent()) {
            // If the cart exists, update it
            cart = existingCartOpt.get();
            cart.getProducts().clear(); // Clear existing items
            cart.getProducts().putAll(cartDetails.getProducts()); // Add new items
            cart.setTotalPrice(cartDetails.getTotalPrice()); // Update total price if needed
            cart.setPaymentStatus(cartDetails.getPaymentStatus()); // Update payment status if needed
        } else {
            // If no cart exists, create a new one
            cart = cartDetails;
            cart.setUser(user); // Set the user to the new cart
        }
        return cartRepository.save(cart);
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
    public void deleteCart(long id) {
        if (!cartRepository.existsById(id)) {
            throw new IllegalStateException("Cart with ID " + id + " does not exist.");
        }
        cartRepository.deleteById(id);
    }
}
