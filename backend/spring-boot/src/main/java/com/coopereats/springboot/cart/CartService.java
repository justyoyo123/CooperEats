package com.coopereats.springboot.cart;

import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Cart createCart(Cart cart, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        cart.setUser(user);
        return cartRepository.save(cart);
    }


    @Transactional
    public Cart updateCart(Long cartId, Cart cartDetails, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));

        Cart existingCart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalStateException("Cart with ID " + cartId + " does not exist."));

        if (!existingCart.getUser().equals(user)) {
            throw new IllegalStateException("Cart does not belong to the user.");
        }

        // Update cart details here
        existingCart.getProducts().clear(); // Clear existing items
        existingCart.getProducts().putAll(cartDetails.getProducts()); // Add new items

        return cartRepository.save(existingCart);
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
