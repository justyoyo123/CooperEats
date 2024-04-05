package com.coopereats.springboot.paymentinfo;
import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.user.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.PaymentMethodCollection;
import com.stripe.param.PaymentMethodListParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.coopereats.springboot.user.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class PaymentInfoService {
    private final PaymentInfoRepository paymentInfoRepository;
    private final UserRepository userRepository;

    @Value("${stripe.api.key}")
    private String apiKey;
    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository, UserRepository userRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
        this.userRepository = userRepository;

    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey; // Set the Stripe API key
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
            paymentInfo = new PaymentInfo();
            paymentInfo.setUser(user);
            // paymentInfo.setBillingAddress(defaultBillingAddress);
            // paymentInfo.setPhoneNumber(defaultPhoneNumber);
            return paymentInfoRepository.save(paymentInfo);
//            throw new IllegalStateException("Payment Info for user ID " + userId + " does not exist.");
        }
        return paymentInfo;
    }
    public void deletePaymentInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with ID " + userId + " does not exist."));
        PaymentInfo paymentInfo = paymentInfoRepository.findByUser(user);
        paymentInfoRepository.deleteById(paymentInfo.getPaymentId());
    }

    public String createStripeCustomer(User user) throws StripeException {
        Map<String, Object> customerParams = new HashMap<>();
        customerParams.put("email", user.getEmail());


        Customer customer = Customer.create(customerParams);
        return customer.getId();
    }

    public void attachPaymentMethodToCustomer(String paymentMethodId, String customerId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        Map<String, Object> params = new HashMap<>();
        params.put("customer", customerId);
        paymentMethod.attach(params);
    }
    public List<PaymentMethod> getCustomerPaymentMethods(String customerId) throws StripeException {
        PaymentMethodListParams params = PaymentMethodListParams.builder()
                .setCustomer(customerId)
                .setType(PaymentMethodListParams.Type.CARD)
                .build();

        List<PaymentMethod> paymentMethods = PaymentMethod.list(params).getData();
        return paymentMethods;
    }

}