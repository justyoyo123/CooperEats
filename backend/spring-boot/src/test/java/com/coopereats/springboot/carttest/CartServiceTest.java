package com.coopereats.springboot.carttest;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.cart.CartService;
import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.food.FoodService;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FoodService foodService;

    @InjectMocks
    private CartService cartService;

    public CartServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateOrUpdateCart() {
        User user = new User();
        user.setUserId(1L);
        Food food = new Food();
        food.setFoodId(1L);
        food.setPrice(10.0);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(foodService.getFoodById(1L)).thenReturn(Optional.of(food));
        when(cartRepository.findByUser(user)).thenReturn(null); // No existing cart

        Cart cart = cartService.createOrUpdateCart(1L, 2, 1L);

        verify(cartRepository).save(any(Cart.class));
        assertThat(cart.getTotalPrice()).isEqualTo(20.0);
        assertThat(cart.getProducts().get(1L)).isEqualTo(2);
    }

    @Test
    public void testGetCartByUser() {
        User user = new User();
        user.setUserId(1L);
        Cart cart = new Cart();
        cart.setCartId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(cart);

        Cart foundCart = cartService.getCartByUser(1L);
        assertThat(foundCart).isEqualTo(cart);
    }

    @Test
    public void testDeleteCart() {
        when(cartRepository.existsById(1L)).thenReturn(true);
        cartService.deleteCart(1L);
        verify(cartRepository).deleteById(1L);
    }
}
