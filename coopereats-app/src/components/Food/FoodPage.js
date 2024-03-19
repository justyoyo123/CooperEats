import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodPage.css'; // Make sure to import the CSS file for styling

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/foods');
        setFoods(response.data);
      } catch (error) {
        setError('Failed to fetch foods');
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="food-menu">
      <h1>Food Menu</h1>
      {error && <p className="error">{error}</p>}
      <div className="food-list">
        {foods.map(food => (
          <div className="food-item" key={food.id}>
            <img src={food.img} alt={food.name} className="food-image" />
            <div className="food-details">
              <h2>{food.name} - ${food.price}</h2>
              <p>Category: {food.category}</p>
              <p>Description: {food.description}</p>
              <p>Quantity: {food.quantity}</p>
              <p>Food ID: {food.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodPage;
