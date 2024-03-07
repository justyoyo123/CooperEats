package com.coopereats.springboot.wishlist;

import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.food.FoodService;
import com.coopereats.springboot.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final FoodService foodService;
    private final CartService cartService;

    @Autowired
    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, FoodService foodService, CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.foodService = foodService;
        this.cartService = cartService;
    }

    @Transactional
    public Wishlist addOrUpdateWishlist(Long foodId, Integer quantity, Long userId) {
        System.out.println("Attempting to find or create wishlist for userId=" + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));

        Optional<Wishlist> existingWishlistOpt = Optional.ofNullable(wishlistRepository.findByUser(user));
        Wishlist wishlist;
        if (existingWishlistOpt.isPresent()) {
            wishlist = existingWishlistOpt.get();
            System.out.println("Existing wishlist found. Updating wishlist for userId=" + userId);
            wishlist.getProducts().put(foodId, quantity); // Add new item
        } else {
            System.out.println("No existing wishlist found. Creating new wishlist for userId=" + userId);
            wishlist = new Wishlist();
            wishlist.getProducts().put(foodId, quantity); // Add new item
            wishlist.setUser(user); // Set the user to the new wishlist
        }
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        System.out.println("Wishlist saved successfully for userId=" + userId + ". Wishlist ID: " + savedWishlist.getWishlistId());
        return savedWishlist;
    }

    private double getProductPrice(Long foodId) {
        Optional<Food> foodOptional = foodService.getFoodById(foodId);
        if (foodOptional.isPresent()) {
            return foodOptional.get().getPrice();
        } else {
            throw new IllegalStateException("Food with ID " + foodId + " does not exist.");
        }
    }

    public Wishlist getWishlistById(long id) {
        return wishlistRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Wishlist with ID " + id + " does not exist."));
    }

    public Wishlist getWishlistByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        Wishlist wishlist = wishlistRepository.findByUser(user);
        if (wishlist == null) {
            throw new IllegalStateException("Wishlist for user ID " + userId + " does not exist.");
        }
        return wishlist;
    }
    @Transactional
    public void moveItemToCart(Long userId, Long foodId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        Wishlist wishlist = wishlistRepository.findByUser(user);

        if (wishlist == null || !wishlist.getProducts().containsKey(foodId)) {
            throw new IllegalStateException("Wishlist item not found for user ID " + userId + ".");
        }

        Integer quantity = wishlist.getProducts().get(foodId);

        // Add the item to the cart
        cartService.createOrUpdateCart(foodId, quantity, userId);

        // Remove the item from the wishlist
        wishlist.getProducts().remove(foodId);
        wishlistRepository.save(wishlist);

        System.out.println("Item moved from wishlist to cart successfully for userId=" + userId + " and foodId=" + foodId);
    }
    @Transactional
    public void deleteWishlist(long id) {
        if (!wishlistRepository.existsById(id)) {
            throw new IllegalStateException("Wishlist with ID " + id + " does not exist.");
        }
        wishlistRepository.deleteById(id);
    }
}
