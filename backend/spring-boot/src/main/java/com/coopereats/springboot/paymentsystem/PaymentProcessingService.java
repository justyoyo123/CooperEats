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

    public PaymentIntent createPaymentIntent(double amount, String customerId, String paymentMethodId) throws StripeException {
        PaymentIntentCreateParams.Builder builder = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100)) // convert amount to cents
                .setCurrency("usd")
                .setCustomer(customerId)
                .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build());

        if (paymentMethodId != null && !paymentMethodId.isEmpty()) {
            builder.setPaymentMethod(paymentMethodId);
        }

        PaymentIntentCreateParams params = builder.build();

        return PaymentIntent.create(params);
    }


}
