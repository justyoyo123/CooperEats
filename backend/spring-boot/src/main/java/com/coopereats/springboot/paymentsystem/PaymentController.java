//https://docs.stripe.com/testing?testing-method=card-numbers#cards
package com.coopereats.springboot.paymentsystem;

import com.coopereats.springboot.user.User;
import com.coopereats.springboot.paymentinfo.PaymentInfo;
import com.coopereats.springboot.paymentinfo.PaymentInfoService;
import com.coopereats.springboot.user.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentProcessingService paymentProcessingService;

    private final PaymentInfoService paymentInfoService;

    private final UserRepository userRepository;

    @Autowired
    public PaymentController(PaymentProcessingService paymentProcessingService, PaymentInfoService paymentInfoService, UserRepository userRepository) {
        this.paymentProcessingService = paymentProcessingService;
        this.paymentInfoService = paymentInfoService;
        this.userRepository = userRepository;
    }

    @PostMapping("/charge")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        try {
            User user = userRepository.findById(paymentRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + paymentRequest.getUserId()));

            PaymentInfo paymentInfo = paymentInfoService.getPaymentInfoByUserId(user.getUserId());
            String customerId = paymentInfo != null ? paymentInfo.getStripeCustomerId() : null;
            // If the user wants to save the card and no Stripe customer exists, create one.
            if (paymentRequest.isSaveCard() && customerId == null) {
                customerId = paymentInfoService.createStripeCustomer(user);
                if (paymentInfo == null) {
                    paymentInfo = new PaymentInfo();
                    paymentInfo.setUser(user);
                }
                paymentInfo.setStripeCustomerId(customerId);
                paymentInfoService.savePaymentInfo(paymentInfo);
            }

            // Ensure the payment method is attached to the customer
            if (paymentRequest.getPaymentMethodId() != null && customerId != null) {
                paymentInfoService.attachPaymentMethodToCustomer(paymentRequest.getPaymentMethodId(), customerId);
                paymentInfo.setPaymentMethodId(paymentRequest.getPaymentMethodId());
                paymentInfoService.savePaymentInfo(paymentInfo);
            }

            // Now create the PaymentIntent with the customer and payment method
            PaymentIntent paymentIntent = paymentProcessingService.createPaymentIntent(paymentRequest.getAmount(), customerId, paymentRequest.getPaymentMethodId());

            return ResponseEntity.ok(Map.of("clientSecret", paymentIntent.getClientSecret()));
        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating payment intent: " + e.getMessage());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }



}