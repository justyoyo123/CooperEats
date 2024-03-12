import React from 'react';
import './FoodList.css';
// Example fake data for food items
const foodItems = [
    {
        foodId: 1,
        name: "Pizza",
        description: "A delicious pizza with tomato sauce, cheese, and pepperoni.",
        price: 10.99,
        // image: "path/to/pizza/image.jpg", // Replace with actual image path or URL
        quantity: 100,
        category: "MAIN_COURSE"
    },
    {
        foodId: 2,
        name: "Cheesecake",
        description: "Creamy cheesecake with a graham cracker crust and strawberries.",
        price: 6.99,
        // image: "path/to/cheesecake/image.jpg", // Replace with actual image path or URL
        quantity: 50,
        category: "DESSERT"
    },
    {
        foodId: 3,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese.",
        price: 8.99,
        // image: "path/to/salad/image.jpg", // Replace with actual image path or URL
        quantity: 75,
        category: "APPETIZER"
    }
    // Add more items as needed
];

const FoodList = () => {
    return (
        <div>
            <h2>Our Food Menu</h2>
            <div className="food-list">
                {foodItems.map((food) => (
                    <div key={food.foodId} className="food-item">
                        <h3>{food.name}</h3>
                        {/* <img src={food.image} alt={food.name} style={{ width: '100px', height: '100px' }} /> */}
                        <p>{food.description}</p>
                        <p>Price: ${food.price}</p>
                        <p>Category: {food.category}</p>
                        {/* Display more information as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;
