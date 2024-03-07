package com.coopereats.springboot.wishlist;

import com.coopereats.springboot.food.Food;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // Create or update a wishlist item
    @PostMapping("/user/{userId}")
    public ResponseEntity<Wishlist> addOrUpdateWishlist(@RequestBody WishlistUpdateRequest request, @PathVariable Long userId) {
        System.out.println("Received wishlist update request for userId=" + userId + " with foodId=" + request.getFoodId() + " and quantity=" + request.getQuantity());
        Wishlist updatedWishlist = wishlistService.addOrUpdateWishlist(request.getFoodId(), request.getQuantity(), userId);
        System.out.println("Wishlist updated successfully for userId=" + userId);
        return ResponseEntity.ok(updatedWishlist);
    }

    // Update an existing wishlist item
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<Wishlist> updateWishlistItem(@PathVariable Long userId, @RequestBody WishlistUpdateRequest request) {
        try {
            Wishlist updatedWishlist = wishlistService.addOrUpdateWishlist(request.getFoodId(), request.getQuantity(), userId);
            return ResponseEntity.ok(updatedWishlist);
        } catch (IllegalStateException e) {
            // Handle specific cases like wishlist not found or wishlist not belonging to the user
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            // Handle other unexpected errors
            return ResponseEntity.notFound().build();
        }
    }

    // Get a wishlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Wishlist> getWishlistById(@PathVariable Long id) {
        Wishlist wishlist = wishlistService.getWishlistById(id);
        return ResponseEntity.ok(wishlist);
    }

    // Get a wishlist by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Wishlist> getWishlistByUserId(@PathVariable Long userId) {
        Wishlist wishlist = wishlistService.getWishlistByUser(userId);
        return ResponseEntity.ok(wishlist);
    }

    // Delete a wishlist item by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable Long id) {
        wishlistService.deleteWishlist(id);
        return ResponseEntity.ok().build();
    }
}
