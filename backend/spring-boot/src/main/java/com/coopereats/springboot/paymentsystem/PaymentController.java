package com.coopereats.springboot.paymentsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentProcessingService paymentProcessingService;

    @Autowired
    public PaymentController(PaymentProcessingService paymentProcessingService) {
        this.paymentProcessingService = paymentProcessingService;
    }

    @PostMapping("/charge")
    public ResponseEntity<String> chargeCard(@RequestBody PaymentRequest paymentRequest) {
        boolean paymentSuccessful = paymentProcessingService.processPayment(paymentRequest.getToken(), paymentRequest.getAmount());
        if (paymentSuccessful) {
            return ResponseEntity.ok("Payment successful");
        } else {
            return ResponseEntity.badRequest().body("Payment failed");
        }
    }
}
