package com.coopereats.springboot.categorytest;

import com.coopereats.springboot.category.Category;
import com.coopereats.springboot.category.CategoryService;
import com.coopereats.springboot.category.CategoryRepository;
import com.coopereats.springboot.category.CategoryController;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CategoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    @AfterEach
    public void cleanUp() {
        categoryRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testAddCategory() {
        // Given: A new category is defined
        Category category = new Category();
        category.setCategoryName("Electronics");
        category.setDescription("All electronic items");
        category.setImageUrl("https://example.com/electronics-image.jpg");

        // When: The category is saved
        categoryRepository.save(category);

        // Then: The category should be saved correctly and retrievable
        Optional<Category> foundCategory = categoryRepository.findById(category.getId());
        assertThat(foundCategory).isPresent();
        foundCategory.ifPresent(c -> {
            assertThat(c.getCategoryName()).isEqualTo("Electronics");
            assertThat(c.getDescription()).isEqualTo("All electronic items");
            assertThat(c.getImageUrl()).isEqualTo("https://example.com/electronics-image.jpg");
        });
    }
}