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

//    @PostMapping("/charge")
//    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
//        try {
//            PaymentIntent paymentIntent = paymentProcessingService.createPaymentIntent(paymentRequest.getAmount());
//            return ResponseEntity.ok(Map.of("clientSecret", paymentIntent.getClientSecret()));
//        } catch (StripeException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment Intent creation failed");
//        }
//    }
//    @PostMapping("/charge")
//    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
//        try {
//            User user = userRepository.findById(paymentRequest.getUserId())
//                    .orElseThrow(() -> new RuntimeException("User not found with id: " + paymentRequest.getUserId()));
//
//            PaymentIntent paymentIntent = paymentProcessingService.createPaymentIntent(paymentRequest.getAmount());
//
//            if (paymentRequest.isSaveCard()) {
//                PaymentInfo paymentInfo = paymentInfoService.getPaymentInfoByUserId(user.getUserId());
//                if (paymentInfo == null) {
//                    paymentInfo = new PaymentInfo();
//                    paymentInfo.setUser(user);
//                }
//
//                // Check if the user already has a Stripe customer ID
//                String customerId = paymentInfo.getStripeCustomerId();
//                if (customerId == null) {
//                    // No Stripe customer ID, so create a new customer
//                    customerId = paymentInfoService.createStripeCustomer(user);
//                    paymentInfo.setStripeCustomerId(customerId);
//                }
//
//                // Attach the PaymentMethod to the customer
//                String paymentMethodId = paymentRequest.getPaymentMethodId();
//                paymentInfoService.attachPaymentMethodToCustomer(paymentMethodId, customerId);
//
//                // Update payment info with the new PaymentMethod ID or any additional details as necessary
//                paymentInfo.setPaymentMethodId(paymentMethodId);
//                paymentInfoService.savePaymentInfo(paymentInfo);
//
//
//            }
//
//            return ResponseEntity.ok(Map.of("clientSecret", paymentIntent.getClientSecret()));
//        } catch (StripeException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment Intent creation failed");
//        } catch (RuntimeException e) {
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    @PostMapping("/charge")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        try {
            User user = userRepository.findById(paymentRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + paymentRequest.getUserId()));

            // Check if user wishes to save card and if PaymentInfo exists
            PaymentInfo paymentInfo = paymentInfoService.getPaymentInfoByUserId(user.getUserId());
            String customerId = null;
            if (paymentRequest.isSaveCard()) {
                if (paymentInfo == null) {
                    paymentInfo = new PaymentInfo();
                    paymentInfo.setUser(user);
                }

                // Create a new Stripe customer if not already present
                customerId = paymentInfo.getStripeCustomerId();
                if (customerId == null) {
                    customerId = paymentInfoService.createStripeCustomer(user); // Assuming you have email in User
                    paymentInfo.setStripeCustomerId(customerId);
                }

                // Save/update PaymentInfo
                paymentInfoService.savePaymentInfo(paymentInfo);
            }

            // Create PaymentIntent with the customer ID if available
            PaymentIntent paymentIntent = paymentProcessingService.createPaymentIntent(paymentRequest.getAmount(), customerId);

            if (paymentRequest.isSaveCard() && paymentRequest.getPaymentMethodId() != null && customerId != null) {
                // Attach the PaymentMethod to the Stripe customer
                paymentInfoService.attachPaymentMethodToCustomer(paymentRequest.getPaymentMethodId(), customerId);

                // Update PaymentInfo with the new payment method ID
                paymentInfo.setPaymentMethodId(paymentRequest.getPaymentMethodId());
                paymentInfoService.savePaymentInfo(paymentInfo);
            }

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