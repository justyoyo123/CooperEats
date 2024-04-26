import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExploreMenu.css';
import { menu_list } from './assets.js';

const ExploreMenu = () => {
    const navigate = useNavigate();

    const handleNavigate = (menuName) => {
        // Navigate to the food page
        navigate('/food', { state: { menuName } });
    };

    // Scroll to a specific position on the FoodPage based on the menu name
    const scrollToPosition = (menuName) => {
        const positions = {
            "Appetizers": 0, // Top of the page
            "Main Course": window.innerHeight * 0.68, // 70% of the viewport height
            "Desserts": window.innerHeight * 1.34, // 85% of the viewport height
            "Drinks": window.innerHeight * 2.04// Bottom of the page
        };
        window.scrollTo({
            top: positions[menuName],
            behavior: 'smooth'
        });
    };

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div key={index} className='explore-menu-list-item' onClick={() => {
                        handleNavigate(item.menu_name);
                        setTimeout(() => scrollToPosition(item.menu_name), 300); // Delay to allow navigation to complete
                    }}>
                        <img src={item.menu_image} alt={item.menu_name} />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExploreMenu;
