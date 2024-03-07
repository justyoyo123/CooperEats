package com.coopereats.springboot;

import com.coopereats.springboot.food.Food;
import com.coopereats.springboot.food.FoodRepository;
import com.coopereats.springboot.food.FoodService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FoodTest {

    @Autowired
    private FoodService foodService;

    @Autowired
    private FoodRepository foodRepository;

    @BeforeEach
    public void setUp() {
        // Initial setup code, if necessary
    }

    @AfterEach
    public void cleanUp() {
        foodRepository.deleteAll(); // Ensure each test is independent
    }

    @Test
    public void testCreateAndRetrieveFood() {
        // Create a new Food object
        Food food = new Food();
        food.setName("Pasta");
        food.setDescription("Delicious Italian pasta.");
        food.setPrice(12.99);
        food.setQuantity(50);
        food.setCategory(Food.Category.MAIN_COURSE);

        // Save the food
        Food savedFood = foodService.saveOrUpdateFood(food);
        assertNotNull(savedFood);
        assertNotNull(savedFood.getFoodId());

        // Retrieve the food
        Optional<Food> retrievedFood = foodService.getFoodById(savedFood.getFoodId());
        assertTrue(retrievedFood.isPresent());
        assertEquals("Pasta", retrievedFood.get().getName());
    }

    @Test
    public void testUpdateFood() {
        // Create and save a Food object
        Food food = new Food();
        food.setName("Burger");
        food.setPrice(8.99);
        food = foodService.saveOrUpdateFood(food);

        // Update the food
        food.setPrice(9.99);
        Food updatedFood = foodService.saveOrUpdateFood(food);

        // Verify the update
        assertEquals(9.99, updatedFood.getPrice());
    }

    @Test
    public void testDeleteFood() {
        // Create and save a Food object
        Food food = new Food();
        food.setName("Salad");
        food = foodService.saveOrUpdateFood(food);

        // Delete the food
        foodService.deleteFood(food.getFoodId());

        // Verify deletion
        Optional<Food> deletedFood = foodService.getFoodById(food.getFoodId());
        assertFalse(deletedFood.isPresent());
    }

    @Test
    public void testGetAllFoods() {
        // Create and save multiple Food objects
        foodService.saveOrUpdateFood(new Food());
        foodService.saveOrUpdateFood(new Food());

        // Retrieve all foods
        List<Food> foods = foodService.getAllFoods();

        // Verify the size of the retrieved foods
        assertTrue(foods.size() >= 2);
    }
}
