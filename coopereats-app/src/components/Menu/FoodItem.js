import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodItem = ({ isAdmin }) => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    quantity: 1,
    category: 'MAIN_COURSE', // Default category
  });

  // Fetch all food items
  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/foods');
      setFoods(response.data);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
  };

  // Handle input change for new food form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  // Create a new food item
  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) {
        const response = await axios.post('/api/foods/{userId}', newFood); // Replace '{userId}' with the actual admin user ID
        fetchFoods(); // Refresh the list of food items
      } else {
        alert('You must be an admin to create food items.');
      }
    } catch (error) {
      console.error('Failed to create food:', error);
    }
  };

  // Delete a food item
  const handleDeleteFood = async (foodId) => {
    try {
      await axios.delete(`/api/foods/${foodId}`);
      fetchFoods(); // Refresh the list of food items
    } catch (error) {
      console.error('Failed to delete food:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div>
      <h2>Food Items</h2>
      <ul>
        {foods.map((food) => (
          <li key={food.foodId}>
            {food.name} - ${food.price}
            {isAdmin && (
              <button onClick={() => handleDeleteFood(food.foodId)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <form onSubmit={handleCreateFood}>
          <input type="text" name="name" placeholder="Name" value={newFood.name} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Description" value={newFood.description} onChange={handleInputChange} />
          <input type="number" name="price" placeholder="Price" value={newFood.price} onChange={handleInputChange} />
          <input type="text" name="image" placeholder="Image URL" value={newFood.image} onChange={handleInputChange} />
          <input type="number" name="quantity" placeholder="Quantity" value={newFood.quantity} onChange={handleInputChange} />
          <select name="category" value={newFood.category} onChange={handleInputChange}>
            <option value="APPETIZER">Appetizer</option>
            <option value="MAIN_COURSE">Main Course</option>
            <option value="DESSERT">Dessert</option>
            <option value="DRINK">Drink</option>
          </select>
          <button type="submit">Create Food Item</button>
        </form>
      )}
    </div>
  );
};

export default FoodItem;
