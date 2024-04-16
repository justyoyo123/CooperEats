package com.coopereats.springboot.carttest;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.cart.CartRepository;
import com.coopereats.springboot.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class CartRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Test
    public void testFindByUser() {
        User user = new User();
        user.setUserId(1L);
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        Cart foundCart = cartRepository.findByUser(user);
        assertThat(foundCart).isNotNull();
        assertThat(foundCart.getUser()).isEqualTo(user);
    }
}
