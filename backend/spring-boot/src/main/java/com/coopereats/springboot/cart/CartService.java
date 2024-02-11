package com.coopereats.springboot.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;

    @Autowired
    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Cart createOrUpdateCart(Cart cart) {
        // This method creates a new cart or updates an existing one.
        Cart existingCart = cartRepository.findByUserId(cart.getUserId());
        if (existingCart != null) {
            cart.setCartId(existingCart.getCartId());
        }
        return cartRepository.save(cart);
    }

    public Optional<Cart> getCartById(long id) {
        return cartRepository.findById(id);
    }

    public Optional<Cart> getCartByUserId(long userId) {
        return Optional.ofNullable(cartRepository.findByUserId(userId));
    }

    @Transactional
    public void deleteCart(long id) {
        cartRepository.deleteById(id);
    }
}
