package com.coopereats.springboot.paymentinfo;

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

    // Add payment info
    @PostMapping
    public ResponseEntity<PaymentInfo> addPaymentInfo(@RequestBody PaymentInfo paymentInfo) {
        PaymentInfo savedPaymentInfo = paymentInfoService.savePaymentInfo(paymentInfo);
        return ResponseEntity.ok(savedPaymentInfo);
    }

    // Get payment info by user ID
    @GetMapping("/{userId}")
    public ResponseEntity<PaymentInfo> getPaymentInfoByUserId(@PathVariable Long userId) {
        return paymentInfoService.getPaymentInfoByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete payment info by user ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deletePaymentInfo(@PathVariable Long userId) {
        paymentInfoService.deletePaymentInfo(userId);
        return ResponseEntity.ok().build();
    }
}