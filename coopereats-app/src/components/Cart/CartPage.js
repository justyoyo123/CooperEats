import React, {useEffect, useState} from 'react';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { useSelector, useDispatch } from "react-redux"
import { changeName, addCount } from "../../store.js"

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
    
    let state = useSelector((state)=> state )
    let dispatch = useDispatch()
    console.log(state.cart)
    
    return (
      <div>
        <h1>Your Shopping Cart</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
        {
            state.cart.map((a, i)=>
                <tr key={i}>
                    <td>{state.cart[i].foodId}</td>
                    <td>{state.cart[i].name}</td>
                    <td>{state.cart[i].category}</td>
                    <td>{state.cart[i].price}</td>
                    <td>{state.cart[i].quantity}</td>
                    <td><button onClick={()=>{
                      dispatch(addCount(state.cart[i].foodId))
                    }}>+</button></td>
                </tr>
            )}
          </tbody>
        </table> 
      </div>
    );
  }

export default CartPage;