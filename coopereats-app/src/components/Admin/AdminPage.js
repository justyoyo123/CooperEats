import React, { useState, useEffect, useRef } from 'react';
import AdminHeader from '../Header/AdminHeader'; // Import the admin header
import axios from 'axios';
import { Tabs, Tab, Box, Card, CardContent, CardMedia, Typography, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminFoodPage.css';

const AdminPage = () => {
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

    const handleIncreaseQuantity = async (foodId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
            let new_quantity = response.data.quantity + 1;
            await axios.post(`http://localhost:8080/api/foods/modifyQuantity/${foodId}`, { quantity: new_quantity });
            console.log("Increase quantity for", foodId);
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    const handleDecreaseQuantity = async (foodId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
            let new_quantity = response.data.quantity - 1;
            await axios.post(`http://localhost:8080/api/foods/modifyQuantity/${foodId}`, { quantity: new_quantity });
            console.log("Decrease quantity for", foodId);
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    const handleDeleteItem = async (foodId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/foods/${foodId}`);
            console.log("Deleted food for", foodId);
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

// Update the rendering part of your component
    return (
        <div className="food-menu">
            <AdminHeader/> {/* Use the admin-specific header */}
            <Typography variant="h3" gutterBottom component="div" sx={{ marginTop: 2, textAlign: 'center' }}>
                Admin Dashboard
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {categories.map((category, index) => (
                        <Tab label={category} key={index} />
                    ))}
                </Tabs>
            </Box>
            {categories.map((category, index) => (
                <Box ref={sectionRefs.current[index]} key={category} sx={{ marginBottom: 4 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        {category}
                    </Typography>
                    <Grid container spacing={3}>
                        {foods.filter(food => food.category === category).map(food => (
                            <Grid item xs={12} sm={6} md={4} key={food.foodId}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={food.img}
                                        alt={food.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {food.name} - ${food.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {food.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity: {food.quantity}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <IconButton color="primary" onClick={() => handleIncreaseQuantity(food.foodId)}>
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleDecreaseQuantity(food.foodId)}>
                                                <RemoveIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteItem(food.foodId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </div>
    );
};
export default AdminPage;
