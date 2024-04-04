import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import garlicBreadSticksImage from '../../foodImages/garlicBread.png';
import chickenWingsImage from '../../foodImages/chickenWing.png';
import stuffedMushroomImage from '../../foodImages/stuffedMushroom.png';
import grilledSalmonImage from '../../foodImages/grilledSalmon.png';
import beefRasagnaImage from '../../foodImages/beefRasagna.png';
import vstirFryImage from '../../foodImages/vstirFry.png';
import dChocolateImage from '../../foodImages/dChocolate.png';
import chocoChipImage from '../../foodImages/chocoChip.png';
import miniChocoChipImage from '../../foodImages/miniChocoChip.png';
import icedLemonImage from '../../foodImages/icedLemon.png';
import mangoSmoothieImage from '../../foodImages/mangoS.png';
import chocoChipMImage from '../../foodImages/chocoChipM.png';
import './FoodPage.css';
import './FoodPage.css';
import FoodItemDetailsModal from './FoodItemDetailsModal'; // Make sure this path is correct


const foodImages = {
  "Garlic Bread Sticks": garlicBreadSticksImage,
  "Chicken Wings": chickenWingsImage,
  "Stuffed Mushrooms": stuffedMushroomImage,
  "Grilled Salmon": grilledSalmonImage,
  "Beef Lasagna":beefRasagnaImage,
  "Vegetable Stir Fry": vstirFryImage,
  "Double Chocolate Muffin": dChocolateImage,
  "Choco Chip Muffin Deluxe": chocoChipImage,
  "Mini Chocolate Muffin": miniChocoChipImage,
  "Iced Lemon Tea": icedLemonImage,
  "Mango Smoothie": mangoSmoothieImage,
  "Choco Chip Muffin Classic": chocoChipMImage,
};

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const sectionRefs = useRef([]);
  const [userId, setUserId] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchUserId = async (firebaseUid) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
            setUserId(response.data);
            console.log("Fetched application user ID:", response.data);
        } catch (error) {
            console.error("Error fetching application user ID:", error);
            setUserId(null);
        }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Fetch the application-specific userId using the Firebase UID
            fetchUserId(user.uid);
        } else {
            // User is signed out
            setUserId(null);
        }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
        fetchCartByUserId();
    }
  }, [userId]); // Fetch cart when userId changes

  // Function to fetch the cart
  const fetchCartByUserId = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
        setCart(response.data);
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/foods');
        setFoods(response.data);
        // Assuming the response includes categories or you extract them from foods
        const fetchedCategories = [...new Set(response.data.map(food => food.category))];
        setCategories(fetchedCategories);
        sectionRefs.current = fetchedCategories.map((_, i) => sectionRefs.current[i] ?? React.createRef());
      } catch (error) {
        console.log('Failed to fetch foods', error);
      }
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentSection = sectionRefs.current.findIndex((ref, i) => {
        const nextRef = sectionRefs.current[i + 1];
        const topEdge = ref.current.offsetTop;
        const bottomEdge = nextRef ? nextRef.current.offsetTop : Infinity;
        const currentPosition = window.scrollY + window.innerHeight / 3; // Adjust this ratio as needed
        return currentPosition >= topEdge && currentPosition < bottomEdge;
      });

      if (currentSection !== activeTab) {
        setActiveTab(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    sectionRefs.current[newValue].current.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to increment quantity
  const incrementQuantity = (foodId) => {
    setQuantities(prev => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
  };

  // Function to decrement quantity
  const decrementQuantity = (foodId) => {
    setQuantities(prev => ({ ...prev, [foodId]: Math.max(1, (prev[foodId] || 1) - 1) }));
  };

  const handleAddToCart = async (foodId) =>{
    try{
      const quantity = quantities[foodId] || 1;
      const response = await axios.post(`http://localhost:8080/api/carts/user/${userId}`, {
        foodId,
        quantity: 1,
      });
      setCart(response.data);
    } catch(error){
      console.error('Failed to add item to cart:', error);
    }
  }  
  return (
    <div className="food-menu">
      <h1>Food Menu</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {categories.map((category, index) => (
            <Tab label={category} key={index} />
          ))}
        </Tabs>
      </Box>
      {categories.map((category, index) => (
        <div ref={sectionRefs.current[index]} key={category}>
          <h2>{category}</h2>
          <div className="food-list">
            {foods.filter(food => food.category === category).map(food => (
              <div className="food-item" key={food.foodId}>
                <img src={foodImages[food.name] || '../../foodImages/cheesecake.jpeg'} alt={food.name} className="food-image" />
                <div className="food-details">
                  <h3>{food.name} - ${food.price}</h3>
                  <p>Description: {food.description}</p>
                  <p>Quantity: {food.quantity}</p>
                  <p>Food ID: {food.foodId}</p>
                </div>
                <div>
                  <IconButton onClick={() => incrementQuantity(food.foodId)}><AddIcon /></IconButton>
                  <span>{quantities[food.foodId] || 1}</span>
                  <IconButton onClick={() => decrementQuantity(food.foodId)}><RemoveIcon /></IconButton>
                </div>
                <button onClick={() => handleAddToCart(food.foodId)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodPage;