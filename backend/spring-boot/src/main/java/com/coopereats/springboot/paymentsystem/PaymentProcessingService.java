package com.coopereats.springboot.paymentsystem;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentProcessingService {

    private final Logger logger = LoggerFactory.getLogger(PaymentProcessingService.class);

    @Value("${stripe.currency:usd}")
    private String currency;

    public boolean processPayment(String token, double amount) {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", (int) (amount * 100)); // Convert dollars to cents
        params.put("currency", currency);
        params.put("source", token); // Token from the frontend
        params.put("description", "Payment for order");

        try {
            Charge charge = Charge.create(params);
            logger.info("Payment successful for amount: {} {}", amount, currency);
            return charge.getPaid();
        } catch (StripeException e) {
            logger.error("Payment failed: {}", e.getMessage(), e);
            return false;
        }
    }
}

