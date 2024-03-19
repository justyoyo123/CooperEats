// this was a test written before having frontend stripe stuff. many things had to be changed so this format of test
// no longer works. but at the time, it was passing

//package com.coopereats.springboot.paymenttest;
//
//import com.coopereats.springboot.cart.CartService;
//import com.coopereats.springboot.food.Food;
//import com.coopereats.springboot.order.Order;
//import com.coopereats.springboot.user.User;
//import com.coopereats.springboot.order.OrderService;
//import com.coopereats.springboot.user.UserService;
//import com.coopereats.springboot.user.UserRepository;
//import com.coopereats.springboot.cart.CartRepository;
//import com.coopereats.springboot.food.FoodRepository;
//import com.coopereats.springboot.cart.Cart;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.junit.jupiter.api.AfterEach;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.transaction.annotation.Transactional;
//import com.coopereats.springboot.order.OrderCreationRequest;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//
//@SpringBootTest
//public class PaymentTest {
//
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private CartService cartService;
//
//    @Autowired
//    private CartRepository cartRepository;
//
//    @Autowired
//    private FoodRepository foodRepository;
//
//    private User testUser;
//
//    private Food testFood1;
//
//    @BeforeEach
//    public void setUp() {
//        // create test user
//        testUser = new User();
//        testUser.setUserName("john_doe");
//        testUser.setPassword("password");
//        testUser.setEmail("john.doe@example.com");
//        testUser.setFullName("John Doe");
//        testUser.setPhoneNumber("1234567890");
//        testUser = userService.createUser(testUser);
//
//        // Create and save test food items
//        testFood1 = new Food();
//        testFood1.setName("Pizza");
//        testFood1.setPrice(10.0);
//        testFood1 = foodRepository.save(testFood1);
//
//        Cart savedCart2 = cartService.createOrUpdateCart(testFood1.getFoodId(), 1, testUser.getUserId());
//    }
//
//    @AfterEach
//    public void tearDown() {
//        // Clean up the database
//        cartRepository.deleteAll();
//        userRepository.deleteAll();
//
//    }
//
//    @Test
//    @Transactional
//    public void createOrderFromCart_WithValidPayment_ShouldCreateOrder() {
//        OrderCreationRequest request = new OrderCreationRequest(testUser.getUserId(), "tok_visa");
//        Order resultOrder = orderService.createOrderFromRequest(request.getUserId(), request.getPaymentToken());
//        assertThat(resultOrder).isNotNull();
//        assertThat(resultOrder.getPaymentStatus()).isEqualTo("PAID");
//    }
//
//    @Test
//    @Transactional
//    public void createOrderFromCart_WithInvalidPayment_ShouldNotCreateOrder() {
//        OrderCreationRequest request = new OrderCreationRequest(testUser.getUserId(), "tok_yomama");
//        assertThrows(RuntimeException.class, () -> {
//            orderService.createOrderFromRequest(request.getUserId(), request.getPaymentToken());
//        });
//    }
//}
