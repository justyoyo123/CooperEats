package com.coopereats.springboot.paymentinfo;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
    PaymentInfo findByUser(User user);
}