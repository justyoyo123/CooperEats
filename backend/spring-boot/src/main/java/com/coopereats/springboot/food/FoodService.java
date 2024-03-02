package com.coopereats.springboot.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public Food saveOrUpdateFood(Food food) {
        return foodRepository.save(food);
    }

    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
