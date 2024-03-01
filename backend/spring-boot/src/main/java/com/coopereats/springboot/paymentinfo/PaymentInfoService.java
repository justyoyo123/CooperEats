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
    public PaymentInfo addorupdatePaymentInfo(Long userId, PaymentInfo paymentInfo) {
        // Find the user by userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        PaymentInfo existingPaymentInfo = paymentInfoRepository.findByUser(user);
        if (existingPaymentInfo != null) {
            // Update fields of the existing payment info with values from PaymentInfo
            existingPaymentInfo.setBillingAddress(paymentInfo.getBillingAddress());
            existingPaymentInfo.setPhoneNumber(paymentInfo.getPhoneNumber());
            existingPaymentInfo.setPaymentMethodId(paymentInfo.getPaymentMethodId());
            return paymentInfoRepository.save(existingPaymentInfo);
        } else {
            paymentInfo.setUser(user);
            return paymentInfoRepository.save(paymentInfo);
        }
    }
    public PaymentInfo savePaymentInfo(PaymentInfo paymentInfo) {
        return paymentInfoRepository.save(paymentInfo);
    }

    public PaymentInfo getPaymentInfoByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        PaymentInfo paymentInfo = paymentInfoRepository.findByUser(user);
        if (paymentInfo == null) {
            throw new IllegalStateException("Payment Info for user ID " + userId + " does not exist.");
        }
        return paymentInfo;
    }
    public void deletePaymentInfo(Long userId) {
        paymentInfoRepository.deleteById(userId);
    }
}