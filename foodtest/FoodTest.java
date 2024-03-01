package com.coopereats.springboot.foodtest;

import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.food.FoodRepository;
import com.coopereats.springboot.food.FoodService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class FoodTest {

    @Mock
    private FoodRepository foodRepository;

    @InjectMocks
    private FoodService foodService;

    private Food testFood;

    @BeforeEach
    public void setUp() {
        // Initialize test Food entity
        testFood = new Food();
        testFood.setName("Pizza");
        testFood.setDescription("Delicious cheese pizza");
        testFood.setPrice(9.99);
        testFood.setQuantity(10);
        testFood.setCategory(Food.Category.MAIN_COURSE);

        // Mocking the repository response
        when(foodRepository.save(any(Food.class))).thenReturn(testFood);
        when(foodRepository.findById(anyLong())).thenReturn(Optional.of(testFood));
    }

    @AfterEach
    public void cleanUp() {
        // Resetting mocks after each test
        reset(foodRepository);
    }

    @Test
    public void testCreateFood() {
        // When
        Food savedFood = foodService.saveOrUpdateFood(testFood);

        // Then
        assertThat(savedFood).isNotNull();
        assertThat(savedFood.getName()).isEqualTo("Pizza");
        verify(foodRepository, times(1)).save(any(Food.class));
    }

    @Test
    public void testGetFoodById() {
        // Given
        long foodId = 1L;

        // When
        Optional<Food> foundFood = foodService.getFoodById(foodId);

        // Then
        assertThat(foundFood).isNotEmpty();
        assertThat(foundFood.get().getName()).isEqualTo("Pizza");
        verify(foodRepository, times(1)).findById(foodId);
    }

    @Test
    public void testDeleteFood() {
        // Given
        long foodId = 1L;

        // When
        foodService.deleteFood(foodId);

        // Then
        verify(foodRepository, times(1)).deleteById(foodId);
    }
}
