package com.coopereats.springboot.paymentinfotest;
import com.coopereats.springboot.paymentinfo.PaymentInfo;
import com.coopereats.springboot.paymentinfo.PaymentInfoRepository;
import com.coopereats.springboot.paymentinfo.PaymentInfoService;
import com.coopereats.springboot.user.User;
import com.coopereats.springboot.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest
public class PaymentInfoTest {
    @Autowired
    private PaymentInfoService paymentInfoService;
    @Autowired
    private PaymentInfoRepository paymentInfoRepository;
    @Autowired
    private UserRepository userRepository;
    private User testUser;
    @BeforeEach
    public void setUp() {
        // Create and save a test user
        testUser = new User();
        testUser.setUserName("testUser");
        testUser.setPassword("password");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("1234567890");
        testUser = userRepository.save(testUser);
    }
    @AfterEach
    public void cleanUp() {
        // Clean up the database after each test to avoid side effects
        paymentInfoRepository.deleteAll();
        userRepository.deleteAll();
    }
    @Test
    @Transactional
    public void testAddPaymentInfo() {
        // Given
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setBillingAddress("123 Test Street");
        paymentInfo.setPhoneNumber("9876543210");
        paymentInfo.setPaymentMethodId("pm_123456789");
        // When
        // Use the testUser's ID when adding payment info
        PaymentInfo savedPaymentInfo = paymentInfoService.addorupdatePaymentInfo(testUser.getUserId(), paymentInfo);
        // Then
        assertThat(savedPaymentInfo).isNotNull();
        assertThat(savedPaymentInfo.getUser()).isEqualTo(testUser);
        assertThat(savedPaymentInfo.getBillingAddress()).isEqualTo("123 Test Street");
        assertThat(savedPaymentInfo.getPhoneNumber()).isEqualTo("9876543210");
        assertThat(savedPaymentInfo.getPaymentMethodId()).isEqualTo("pm_123456789");
    }
}
has context menu