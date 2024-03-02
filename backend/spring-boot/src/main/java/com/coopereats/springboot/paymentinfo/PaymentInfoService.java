package com.coopereats.springboot.paymentinfo;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.coopereats.springboot.user.UserRepository;

import java.util.Optional;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository, UserRepository userRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
        this.userRepository = userRepository;
    }

    public PaymentInfo addPaymentInfo(Long userId, PaymentInfo paymentInfo) {
        // Find the user by userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Associate the payment info with the user
        paymentInfo.setUser(user);

        // Save the payment info
        return paymentInfoRepository.save(paymentInfo);
    }

    public PaymentInfo savePaymentInfo(PaymentInfo paymentInfo) {
        return paymentInfoRepository.save(paymentInfo);
    }

//    public Optional<PaymentInfo> getPaymentInfoByUserId(Long userId) {
//        return paymentInfoRepository.findById(userId);
//    }

    public PaymentInfo getPaymentInfoByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        PaymentInfo paymentInfo = paymentInfoRepository.findByUser(user);
        if (paymentInfo == null) {
            throw new IllegalStateException("Cart for user ID " + userId + " does not exist.");
        }
        return paymentInfo;
    }

    public void deletePaymentInfo(Long userId) {
        paymentInfoRepository.deleteById(userId);
    }
}
