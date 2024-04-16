package com.coopereats.springboot.wishlisttest;

import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserService;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.wishlist.Wishlist;
import com.coopereats.springboot.wishlist.WishlistService;
import com.coopereats.springboot.food.FoodRepository;
import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class WishlistTest {

    @Autowired
    private WishlistService wishlistService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private FoodRepository foodRepository;

    private User testUser;
    private Food testFood1;

    @BeforeEach
    public void setUp() {
        // Initialize and save a test user
        testUser = new User();
        testUser.setUserName("testUser");
        testUser.setPassword("password");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("1234567890");
        testUser = userRepository.save(testUser);

        // Create and save test food items
        testFood1 = new Food();
        testFood1.setName("Pizza");
        testFood1.setPrice(10.0);
        testFood1 = foodRepository.save(testFood1);
    }

    @AfterEach
    public void cleanUp() {
        // Clean up the database after each test
        userRepository.deleteAll();
        foodRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testMoveItemFromWishlistToCart() {
        // Given a foodId and quantity to add to the wishlist
        Long foodId = 1L; // Assume this food item exists in your database
        Integer quantity = 2;

        // Add an item to the wishlist
        wishlistService.addOrUpdateWishlist(foodId, quantity, testUser.getUserId());

        // Move the item from the wishlist to the cart
        wishlistService.moveItemToCart(testUser.getUserId(), foodId);

        // Verify the item is removed from the wishlist
        Wishlist wishlist = wishlistService.getWishlistByUser(testUser.getUserId());
        assertThat(wishlist.getProducts()).doesNotContainKey(foodId);

        // Verify the item is added to the cart
        Cart cart = cartService.getCartByUser(testUser.getUserId());
        assertThat(cart.getProducts()).containsKey(foodId);
        assertThat(cart.getProducts().get(foodId)).isEqualTo(quantity);
    }

    @Test
    public void testWishlistGettersAndSetters() {
        // Create and configure a Wishlist instance
        Wishlist wishlist = new Wishlist();
        wishlist.setWishlistId(123L);
        wishlist.setUser(testUser);

        // Verify getters and setters
        assertThat(wishlist.getWishlistId()).isEqualTo(123L);
        assertThat(wishlist.getUser()).isEqualTo(testUser);
    }
}