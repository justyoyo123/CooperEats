// test credit card numbers: https://docs.stripe.com/testing
import React, {useEffect, useState} from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {Card, CardContent, Typography, Button, Box, Checkbox, FormControlLabel, Snackbar, TextField} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import './CheckoutForm.css';
import {getAuth, onAuthStateChanged} from "firebase/auth";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    }
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [saveCard, setSaveCard] = useState(false); // State for saving card information
    const [savedPaymentMethodId, setSavedPaymentMethodId] = useState("");
    const [paymentInfoLoaded, setPaymentInfoLoaded] = useState(false);
    const [hasSavedPaymentInfo, setHasSavedPaymentInfo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [pickupTime, setPickupTime] = useState("");

    useEffect(() => {
        const fetchUserId = async (firebaseUid) => {
            try {
                const response = await axios.get(`http://20.88.180.242:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
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
        loadSavedPaymentMethods();
    }, []);
    const loadSavedPaymentMethods = async () => {
        console.log("Loading saved payment methods for user ID:", userId);
        try {
            // Directly fetch the user's payment info, which includes the paymentMethodId
            const { data: paymentInfo } = await axios.get(`http://20.88.180.242:8080/api/paymentinfo/${userId}`);
            console.log("Retrieved payment info:", paymentInfo); // Log the retrieved payment info

            if (paymentInfo && paymentInfo.paymentMethodId) {
                // we save paymentmethodId in table so just use that
                console.log("Saved paymentMethodId found:", paymentInfo.paymentMethodId);
                setSavedPaymentMethodId(paymentInfo.paymentMethodId);
                setHasSavedPaymentInfo(true);
            } else {
                console.log('No saved payment method found for user.');
                setSavedPaymentMethodId("");
                setHasSavedPaymentInfo(false);
            }
        } catch (error) {
            console.error('Error fetching saved payment method:', error);
        } finally {
            console.log("Finished loading saved payment methods.");
        }
    };

    const handleSaveCardChange = (event) => {
        setSaveCard(event.target.checked);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log('Stripe.js has not yet loaded.');
            return;
        }

        // Retrieve cart details to get product quantities
        const cartResponse = await axios.get(`http://20.88.180.242:8080/api/carts/user/${userId}`);
        const cartItems = cartResponse.data.products;

        // Check quantities for each cart item
        const stockIssues = []; // Keep track of items that exceed stock
        for (const [foodId, quantityOrdered] of Object.entries(cartItems)) {
            try {
                const foodResponse = await axios.get(`http://20.88.180.242:8080/api/foods/${foodId}`);
                // const {quantity: quantityAvailable, name} = foodResponse.data.quantity;
                const quantityAvailable = foodResponse.data.quantity;
                const name = foodResponse.data.name;

                console.log('quant avail:', quantityAvailable);
                console.log('name:', name);
                console.log('quant ordered:', quantityOrdered);
                if (quantityOrdered > quantityAvailable) {
                    stockIssues.push({ name, quantityLeft: quantityAvailable });
                }
            } catch (error) {
                console.error(`Failed to fetch food item ${foodId}:`, error);
            }
        }

        // If there are stock issues, alert the user and prevent order submission
        if (stockIssues.length > 0) {
            console.log('Stock Issues Detected:', stockIssues);
            const message = stockIssues.map(issue => `Only ${issue.quantityLeft} ${issue.name} left. Please remove excess items from your cart.`).join("\n");
            alert(message);
            return; // Prevent further execution
        }

        let paymentMethodId = savedPaymentMethodId;
        if (!paymentMethodId) {
            // Create a new payment method if no saved method is selected
            const cardElement = elements.getElement(CardElement);
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                console.error(error);
                return;
            }

            paymentMethodId = paymentMethod.id;
        }

        //get total amount from cart
        const response = await axios.get(`http://20.88.180.242:8080/api/carts/user/${userId}`);
        let cartTotalAmount = 0;
        cartTotalAmount = response.data.totalPrice;

        const paymentPayload = {
            amount: cartTotalAmount,
            saveCard,
            paymentMethodId,
            userId,
        };

        try {
            // Call backend to create the PaymentIntent and optionally save the card
            const { data: paymentIntentResponse } = await axios.post('http://20.88.180.242:8080/api/payments/charge', paymentPayload);

            // Confirm the payment on the frontend
            const confirmResult = await stripe.confirmCardPayment(paymentIntentResponse.clientSecret, {
                payment_method: paymentMethodId,
            });

            if (confirmResult.error) {
                console.error(confirmResult.error);
            } else if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded!');
                setPaymentSuccess(true);

                // After successful payment, send a request to create the order
                const orderRequest = {
                    userId: userId,
                    paymentIntentId: confirmResult.paymentIntent.id,
                    pickupTime: pickupTime,
                };

                // Send the order creation request
                const orderResponse = await axios.post('http://20.88.180.242:8080/api/orders/placeOrder', orderRequest);
                console.log('Order created successfully:', orderResponse.data);
                setOrderId(orderResponse.data.orderId);
            }
        } catch (error) {
            console.error('Error during the payment or order creation process:', error);
        }
    };

    const handleFoodUpdate = async () => {
        try {
            const orderResponse = await axios.get(`http://20.88.180.242:8080/api/orders/${orderId}`);
            let orderedProducts = orderResponse.data.products;

            // Iterate over each product in the order
            for (const [foodId, orderedQuantity] of Object.entries(orderedProducts)) {
                // Fetch the current quantity of the food item
                const foodResponse = await axios.get(`http://20.88.180.242:8080/api/foods/${foodId}`);
                const currentQuantity = foodResponse.data.quantity;

                // Calculate the new quantity after subtracting the ordered amount
                const newQuantity = currentQuantity - orderedQuantity;

                // Update the quantity in the backend
                await axios.post(`http://20.88.180.242:8080/api/foods/modifyQuantity/${foodId}`, { quantity: newQuantity });
                console.log(`Quantity updated for food ID ${foodId}: ${newQuantity}`);
            }

        } catch (error) {
            console.error('Failed to update food quantities:', error);
        }
    };

    if (paymentSuccess) {
        handleFoodUpdate();
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                            <Typography gutterBottom variant="h5" component="div" color="textPrimary" textAlign="center">
                                Payment Successful!
                            </Typography>
                            <Typography variant="body2" color="textSecondary" textAlign="center">
                                Your payment has been processed successfully and your order has been placed.
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box m={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" href="/">
                            Continue Shopping
                        </Button>
                    </Box>
                </Card>
            </Box>
        );
    } else {
        return (
            <Box className="checkout-form" sx={{ maxWidth: 400, m: '40px auto', boxShadow: 3, p: 2, borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: 'text.primary' }}>
                        Credit or Debit Card
                    </Typography>
                    <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
                    <FormControlLabel
                        control={<Checkbox checked={saveCard} onChange={handleSaveCardChange} name="saveCard" />}
                        label="Save this card for future transactions"
                    />
                    <Button onClick={() => {
                        setHasSavedPaymentInfo(null);
                        loadSavedPaymentMethods();
                        setPaymentInfoLoaded(true); // Set the state to true when the payment methods are loaded
                    }} variant="outlined" sx={{ mt: 2, mb: 2 }}>
                        Load Saved Payment Methods
                    </Button>
                    {paymentInfoLoaded && hasSavedPaymentInfo === true && (
                        <Snackbar
                            open={paymentInfoLoaded}
                            autoHideDuration={6000}
                            onClose={() => setPaymentInfoLoaded(false)}
                            message="Payment info loaded. Click pay to proceed."
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        />
                    )}
                    {paymentInfoLoaded && hasSavedPaymentInfo === false && (
                        <Snackbar
                            open={paymentInfoLoaded}
                            autoHideDuration={6000}
                            onClose={() => setHasSavedPaymentInfo(null)}
                            message="No saved payment info."
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        />
                    )}
                    <TextField
                        id="pickup-time"
                        label="Pickup Time"
                        type="datetime-local"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        sx={{ mt: 2, mb: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!stripe}>
                        Pay
                    </Button>
                </form>
            </Box>
        );
    }
};

export default CheckoutForm;