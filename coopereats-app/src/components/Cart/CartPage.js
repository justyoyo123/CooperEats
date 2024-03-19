import React, {useEffect, useState} from 'react';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";

//const userId = 1; // Placeholder user ID, EDIT after firebase is configured

const CartPage = () => {
    const navigate = useNavigate();
    //below is logic taken from checkoutform to dynamically get userid based off who is currently logged in. can maybe wrap in its own function but fine for now
    const [userId, setUserId] = useState(null);

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
    const goToCheckout = () => {
        navigate('/payment'); // Navigate to CheckoutForm
    };

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            <Cart userId={userId} />
            <button onClick={goToCheckout}>Proceed to Checkout</button>
            {/* You can add more content or layout around the Cart component here */}
        </div>
    );
};

export default CartPage;
