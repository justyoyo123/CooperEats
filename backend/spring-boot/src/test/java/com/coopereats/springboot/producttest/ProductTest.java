package com.coopereats.springboot.producttest;

import com.coopereats.springboot.category.Category;
import com.coopereats.springboot.category.CategoryRepository;
import com.coopereats.springboot.product.Product;
import com.coopereats.springboot.product.ProductRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ProductTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category testCategory;

    @BeforeEach
    public void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        testCategory = new Category();
        testCategory.setCategoryName("Electronics");
        testCategory.setDescription("Category for electronic items");
        categoryRepository.save(testCategory);
    }

    @AfterEach
    public void cleanUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testAddProduct() {
        // Given
        Product product = new Product();
        product.setName("Laptop");
        product.setDescription("A high-performance gaming laptop");
        product.setCategory(testCategory);

        // When
        productRepository.save(product);

        // Then
        Optional<Product> foundProduct = productRepository.findById(product.getId());
        assertThat(foundProduct).isPresent();
        foundProduct.ifPresent(p -> {
            assertThat(p.getName()).isEqualTo("Laptop");
            assertThat(p.getDescription()).isEqualTo("A high-performance gaming laptop");
            assertThat(p.getCategory()).isEqualTo(testCategory);
        });
    }
}
