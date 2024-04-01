import React, { useState, useEffect, useRef, createRef } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, Card, CardContent, CardMedia, Typography, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminFoodPage.css';

const AdminPage = () => {
    const CATEGORIES = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK'];
    const [foods, setFoods] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const sectionRefs = useRef(CATEGORIES.map(() => React.createRef()));

    const fetchFoods = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/foods');
            setFoods(response.data);
        } catch (error) {
            console.error('Failed to fetch foods', error);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        const sectionRef = sectionRefs.current[newValue];
        if (sectionRef && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentSection = sectionRefs.current.findIndex((ref, i) => {
                const nextRef = sectionRefs.current[i + 1];
                const topEdge = ref.current.offsetTop;
                const bottomEdge = nextRef ? nextRef.current.offsetTop : Infinity;
                const currentPosition = window.scrollY + window.innerHeight / 3;
                return currentPosition >= topEdge && currentPosition < bottomEdge;
            });

            if (currentSection !== activeTab) {
                setActiveTab(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    const handleIncreaseQuantity = async (foodId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
            let new_quantity = response.data.quantity + 1;
            await axios.post(`http://localhost:8080/api/foods/modifyQuantity/${foodId}`, { quantity: new_quantity });
            console.log("Increase quantity for", foodId);
            fetchFoods(); // Refetch foods list to update UI
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
            fetchFoods(); // Refetch foods list to update UI
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    const handleDeleteItem = async (foodId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/foods/${foodId}`);
            console.log("Deleted food for", foodId);
            fetchFoods(); // Refetch foods list to update UI
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    return (
        <div className="food-menu">
            <Typography variant="h3" gutterBottom component="div" sx={{ marginTop: 2, textAlign: 'center' }}>
                Admin Dashboard
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {CATEGORIES.map((category, index) => (
                        <Tab label={category.replace('_', ' ')} key={index} />
                    ))}
                </Tabs>
            </Box>
            {CATEGORIES.map((category, index) => (
                <Box key={category} ref={sectionRefs.current[index]} sx={{ marginBottom: 4 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        {category.replace('_', ' ')}
                    </Typography>
                    <Grid container spacing={3}>
                        {foods.filter(food => food.category === category)
                            .sort((a, b) => a.foodId - b.foodId)
                            .map(food => (
                                <Grid item xs={12} sm={6} md={4} key={food.foodId}>
                                    <Card sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '100%',
                                        minHeight: 450,
                                    }}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                height: 140,
                                                objectFit: 'cover',
                                            }}
                                            image={food.img}
                                            alt={food.name}
                                        />
                                        <CardContent sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}>
                                            <div>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {food.name} - ${food.price}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 100 }}>
                                                    {food.description}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2" color="text.secondary">
                                                    Quantity: {food.quantity}
                                                </Typography>
                                                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                                                    <IconButton color="primary"
                                                                onClick={() => handleIncreaseQuantity(food.foodId)}>
                                                        <AddIcon/>
                                                    </IconButton>
                                                    <IconButton color="secondary"
                                                                onClick={() => handleDecreaseQuantity(food.foodId)}>
                                                        <RemoveIcon/>
                                                    </IconButton>
                                                    <IconButton color="error"
                                                                onClick={() => handleDeleteItem(food.foodId)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Box>
                                            </div>
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
