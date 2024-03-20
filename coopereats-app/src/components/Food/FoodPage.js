import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box } from '@mui/material';
import './FoodPage.css';

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const sectionRefs = useRef([]);

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
              <div className="food-item" key={food.id}>
                <img src={food.img} alt={food.name} className="food-image" />
                <div className="food-details">
                  <h3>{food.name} - ${food.price}</h3>
                  <p>Description: {food.description}</p>
                  <p>Quantity: {food.quantity}</p>
                  <p>Food ID: {food.food_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodPage;
