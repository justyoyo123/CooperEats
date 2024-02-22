package com.coopereats.springboot.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Create a cart
    @PostMapping("/user/{userId}")
    public ResponseEntity<Cart> createOrUpdateCart(@RequestBody Cart cart, @PathVariable Long userId) {
        Cart updatedCart = cartService.createOrUpdateCart(cart, userId);
        return ResponseEntity.ok().build();
    }
    // update an existing cart
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long userId, @RequestBody Cart cartDetails) {
        try {
            Cart updatedCart = cartService.createOrUpdateCart(cartDetails, userId);
            return ResponseEntity.ok(updatedCart);
        } catch (IllegalStateException e) {
            // Handle specific cases like cart not found or cart not belonging to the user
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            // Handle other unexpected errors
            return ResponseEntity.notFound().build();
        }
    }

    // Get a cart by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<Long, Integer>> getCartById(@PathVariable Long id) {
        Cart cart = cartService.getCartById(id);
        Map<Long, Integer> products = cart.getProducts();
        return ResponseEntity.ok(products);
    }

    // Get a cart by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<Long, Integer>> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUser(userId);
        Map<Long, Integer> products = cart.getProducts();
        return ResponseEntity.ok(products);
    }

    // Delete a cart by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.ok().build();
    }
}