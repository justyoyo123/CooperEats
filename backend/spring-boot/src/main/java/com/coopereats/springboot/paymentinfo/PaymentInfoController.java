package com.coopereats.springboot.paymentinfo;

import com.coopereats.springboot.cart.Cart;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import com.coopereats.springboot.paymentinfo.PaymentInfoRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paymentinfo")
public class PaymentInfoController {

    private final PaymentInfoService paymentInfoService;

    private final UserRepository userRepository;

    private final PaymentInfoRepository paymentInfoRepository;

    @Autowired
    public PaymentInfoController(PaymentInfoService paymentInfoService, UserRepository userRepository, PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoService = paymentInfoService;
        this.userRepository = userRepository;
        this.paymentInfoRepository = paymentInfoRepository;
    }

    // Add payment info for a specific user
    @PostMapping("/user/{userId}")
    public ResponseEntity<PaymentInfo> addPaymentInfo(@PathVariable Long userId, @RequestBody PaymentInfo paymentInfo) {
        PaymentInfo savedPaymentInfo = paymentInfoService.addorupdatePaymentInfo(userId, paymentInfo);
        return ResponseEntity.ok(savedPaymentInfo);
    }

    // Get payment info by user ID
    @GetMapping("/{userId}")
    public ResponseEntity<PaymentInfo> getPaymentInfoByUserId(@PathVariable Long userId) {
        PaymentInfo paymentInfo = paymentInfoService.getPaymentInfoByUserId(userId);
        return ResponseEntity.ok(paymentInfo);
    }

    // Delete payment info by payment ID
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePaymentInfo(@PathVariable Long paymentId) {
        paymentInfoService.deletePaymentInfo(paymentId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<PaymentInfo> updatePaymentInfo(@PathVariable Long userId, @RequestBody PaymentInfo newPaymentInfo) {
        PaymentInfo updatedPaymentInfo = paymentInfoService.addorupdatePaymentInfo(userId, newPaymentInfo);
        if (updatedPaymentInfo != null) {
            return ResponseEntity.ok(updatedPaymentInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/savedPaymentMethods/{stripeCustomerId}")
    public ResponseEntity<?> getSavedPaymentMethods(@PathVariable String stripeCustomerId) {
        try {
            List<PaymentMethod> savedPaymentMethods = paymentInfoService.getSavedPaymentMethods(stripeCustomerId);
            return ResponseEntity.ok(savedPaymentMethods);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching saved payment methods: " + e.getMessage());
        }
    }

}