package com.coopereats.springboot.paymentsystem;

import io.micrometer.common.lang.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.exception.StripeException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentProcessingService {

    @Value("${stripe.api.key}")
    private String apiKey;

//    public PaymentIntent createPaymentIntent(double amount, @Nullable String customerId) throws StripeException {
//        Stripe.apiKey = apiKey;
//
//        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
//                .setAmount((long) (amount * 100)) // Convert amount to cents
//                .setCurrency("usd")
//                .addPaymentMethodType("card");
//
//        if (customerId != null && !customerId.trim().isEmpty()) {
//            paramsBuilder.setCustomer(customerId);
//        }
//
//        PaymentIntentCreateParams params = paramsBuilder.build();
//        return PaymentIntent.create(params);
//    }
//    public PaymentIntent createPaymentIntent(double amount, String customerId, String paymentMethodId, boolean confirmNow) throws StripeException {
//        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
//                .setAmount((long) (amount * 100)) // convert amount to cents
//                .setCurrency("usd")
//                .setCustomer(customerId);
//
//        if (paymentMethodId != null && !paymentMethodId.isEmpty()) {
//            paramsBuilder.setPaymentMethod(paymentMethodId);
//        }
//
//        if (confirmNow) {
//            paramsBuilder
//                    .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC)
//                    .setConfirm(true)
//                    .setOffSession(true); // Only include off_session when confirming immediately
//        }
//
//        PaymentIntentCreateParams params = paramsBuilder.build();
//        return PaymentIntent.create(params);
//    }
    public PaymentIntent createPaymentIntent(double amount, String customerId, String paymentMethodId) throws StripeException {
        PaymentIntentCreateParams.Builder builder = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100)) // convert amount to cents
                .setCurrency("usd")
                .setCustomer(customerId)
                .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build());

        if (paymentMethodId != null && !paymentMethodId.isEmpty()) {
            builder.setPaymentMethod(paymentMethodId);
        }

//        if (confirm) {
//            builder.setConfirm(true)
//                    .setOffSession(true); // Required if confirming the payment intent immediately
//        }

        // Since the Stripe Java library may not directly allow setting "allow_redirects" to "never",
        // enabling automatic_payment_methods and setting off_session to true aims to prioritize
        // non-redirect payment methods automatically.

        PaymentIntentCreateParams params = builder.build();

        return PaymentIntent.create(params);
    }


}

