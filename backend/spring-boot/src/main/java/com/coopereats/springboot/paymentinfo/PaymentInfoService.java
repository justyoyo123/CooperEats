package com.coopereats.springboot.paymentinfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public PaymentInfo savePaymentInfo(PaymentInfo paymentInfo) {
        return paymentInfoRepository.save(paymentInfo);
    }

    public Optional<PaymentInfo> getPaymentInfoByUserId(Long userId) {
        return paymentInfoRepository.findById(userId);
    }

    public void deletePaymentInfo(Long userId) {
        paymentInfoRepository.deleteById(userId);
    }
}
