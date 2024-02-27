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
        PaymentInfo savedPaymentInfo = paymentInfoService.addPaymentInfo(userId, paymentInfo);
        return ResponseEntity.ok(savedPaymentInfo);
    }

    // Get payment info by user ID
    @GetMapping("/{userId}")
    public ResponseEntity<PaymentInfo> getPaymentInfoByUserId(@PathVariable Long userId) {
        PaymentInfo paymentInfo = paymentInfoService.getPaymentInfoByUserId(userId);
        return ResponseEntity.ok(paymentInfo);
    }

    // Delete payment info by user ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deletePaymentInfo(@PathVariable Long userId) {
        paymentInfoService.deletePaymentInfo(userId);
        return ResponseEntity.ok().build();
    }
}