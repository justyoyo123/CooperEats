package com.coopereats.springboot.paymentinfo;

import com.coopereats.springboot.cart.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentInfoController {

    private final PaymentInfoService paymentInfoService;

    @Autowired
    public PaymentInfoController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
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
}