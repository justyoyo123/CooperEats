package com.example.menu.item;

import org.springframework.data.map.repository.config.EnableMapRepositories;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@EnableMapRepositories
public class ItemService {
    private final InMemoryItemRepository repository;

    public ItemService(InMemoryItemRepository repository) {
        this.repository = repository;
        this.repository.saveAll(defaultItems());
    }

    private static List<Item> defaultItems() {
        return List.of(
            new Item(1L, "Burger", 599L, "Tasty", "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"),
            new Item(2L, "Pizza", 299L, "Cheesy", "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png"),
            new Item(3L, "Tea", 199L, "Informative", "https://cdn.auth0.com/blog/whatabyte/tea-sm.png")
        );
    }

    public List<Item> findAll() {
        List<Item> list = new ArrayList<>();
        repository.findAll().forEach(list::add);
        return list;
    }

    public Optional<Item> find(Long id) {
        return repository.findById(id);
    }

    public Item create(Item item) {
        return repository.save(item);
    }

    public Optional<Item> update(Long id, Item newItem) {
        return repository.findById(id)
                .map(oldItem -> repository.save(oldItem.updateWith(newItem)));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
