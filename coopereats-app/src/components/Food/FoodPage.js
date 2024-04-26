import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Tabs, Tab, Box, Button, IconButton, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import garlicBreadSticksImage from '../../foodImages/garlicBS.jpeg';
import chickenWingsImage from '../../foodImages/chickenWing.png';
import stuffedMushroomImage from '../../foodImages/smr.jpeg';
import grilledSalmonImage from '../../foodImages/grilledSalmon.png';
import beefRasagnaImage from '../../foodImages/beefRasagna.png';
import vstirFryImage from '../../foodImages/vsfry.jpeg';
import dChocolateImage from '../../foodImages/dChocolate.png';
import chocoChipImage from '../../foodImages/cchipmuffin2.jpeg';
import miniChocoChipImage from '../../foodImages/miniChocoChip.png';
import icedLemonImage from '../../foodImages/iltea.jpeg';
import mangoSmoothieImage from '../../foodImages/mangoS.png';
import chocoChipMImage from '../../foodImages/chocoChipM.png';
import './FoodPage.css';
import FoodItemDetailsModal from './FoodItemDetailsModal'; // Make sure this path is correct
import FoodItem from './FoodItem';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


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
        const sortedCategories = fetchedCategories.sort((a, b) => {
          return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
        });
        setCategories(sortedCategories);
        sectionRefs.current = sortedCategories.map((_, i) => sectionRefs.current[i] ?? React.createRef());
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

  const handleAddToCart = async (foodId) => {
    if (!userId) {
        setSnackbarMessage('Please log in to add items to the cart.');
        setSnackbarOpen(true);
    } else {
        try {
            const quantity = quantities[foodId] || 1;
            const response = await axios.post(`http://localhost:8080/api/carts/user/${userId}`, {
                foodId,
                quantity: quantity,
            });
            setCart(response.data);
            setSnackbarMessage('Item added to cart!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    }
}

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const categoryDisplayNames = {
    MAIN_COURSE: "Main Course",
    DRINK: "Drinks",
    APPETIZER: "Appetizers",
    DESSERT: "Desserts",
  };
  const categoryOrder = ["APPETIZER", "MAIN_COURSE", "DESSERT", "DRINK"];

  return (
      <div className="food-menu">
        {/* <h1>Food Menu</h1> */}
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            {categories.map((category, index) => (
                <Tab label={category} key={index} />
            ))}
          </Tabs>
        </Box> */}
        <div className="categories-sidebar">
          <ul>
            {categories.map((category, index) => (
              <li key={index} onClick={() => handleTabChange(null, index)}>
                {categoryDisplayNames[category] || category}
              </li>
            ))}
          </ul>
        </div>
        <div className="actual-content">
          {categories.map((category, index) => (
              <div ref={sectionRefs.current[index]} key={category}>
                <h2>{categoryDisplayNames[category] || category}</h2>
                <div className="food-list">
                  {foods.filter(food => food.category === category).map(food => (
                      <div className="food-item" key={food.foodId}>
                        <div className='food-image-container'>
                          <img src={foodImages[food.name] || '../../foodImages/cheesecake.jpeg'} alt={food.name} className="food-image" />
                        </div>
                        <div className="food-details">
                          <h3>{food.name}</h3>
                          <h3>${food.price}</h3>
                          <p>{food.description}</p>
                        </div>
                        <div>
                        {/* {food.quantity > 0 ? (
                          <>
                            <IconButton onClick={() => incrementQuantity(food.foodId)}><AddIcon /></IconButton>
                            <span>{quantities[food.foodId] || 1}</span>
                            <IconButton onClick={() => decrementQuantity(food.foodId)}><RemoveIcon /></IconButton>
                            <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={() => handleAddToCart(food.foodId)}>
                              Add {quantities[food.foodId] || 1} to Cart
                            </Button>
                          </>
                        ) : (
                          <Button variant="outlined" disabled>
                            Sold Out
                          </Button>
                        )} */}
                          {/* <IconButton onClick={() => incrementQuantity(food.foodId)}><AddIcon /></IconButton>
                          <span>{quantities[food.foodId] || 1}</span>
                          <IconButton onClick={() => decrementQuantity(food.foodId)}><RemoveIcon /></IconButton>
                        </div>
                        <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={() => handleAddToCart(food.foodId)}>
                          Add {quantities[food.foodId]||1} to Cart
                        </Button> */}
                      </div>
                      {food.quantity > 0 ? (
                        <FoodItem name={food.name} foodId={food.foodId} />
                      ) : (
                        <Typography variant="h6" style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                          Sold Out
                        </Typography>
                      )}
                      </div>
                  ))}
                </div>
              </div>
          ))}
        </div>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
        />
      </div>
  );
}
export default FoodPage;