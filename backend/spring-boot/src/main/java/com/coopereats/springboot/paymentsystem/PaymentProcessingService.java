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

//    public PaymentIntent createPaymentIntent(double amount) throws StripeException {
//        Stripe.apiKey = apiKey;
//        System.out.println("amount " + amount);
//        List<Object> paymentMethodTypes = new ArrayList<>();
//        paymentMethodTypes.add("card");
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("amount", (int) (amount * 100)); // Convert to cents
//        params.put("currency", "usd");
//        params.put("payment_method_types", paymentMethodTypes);
//
//        return PaymentIntent.create(params);
//    }
//
//    public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
//        Stripe.apiKey = apiKey;
//        return PaymentIntent.retrieve(paymentIntentId);
//    }
    public PaymentIntent createPaymentIntent(double amount, @Nullable String customerId) throws StripeException {
        Stripe.apiKey = apiKey;

        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100)) // Convert amount to cents
                .setCurrency("usd")
                .addPaymentMethodType("card");

        if (customerId != null && !customerId.trim().isEmpty()) {
            paramsBuilder.setCustomer(customerId);
        }

        PaymentIntentCreateParams params = paramsBuilder.build();
        return PaymentIntent.create(params);
    }

}

