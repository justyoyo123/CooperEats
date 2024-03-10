// test credit card numbers: https://docs.stripe.com/testing
import React, {useEffect, useState} from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {Card, CardContent, Typography, Button, Box, Checkbox, FormControlLabel, Snackbar} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import './CheckoutForm.css';

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
    const [loadingSavedMethods, setLoadingSavedMethods] = useState(true);
    const [savedPaymentMethodId, setSavedPaymentMethodId] = useState("");
    const [paymentInfoLoaded, setPaymentInfoLoaded] = useState(false);
    const [hasSavedPaymentInfo, setHasSavedPaymentInfo] = useState(null);

    const userId = 1; // should be dynamically set

    useEffect(() => {
        loadSavedPaymentMethods();
    }, []);
    const loadSavedPaymentMethods = async () => {
        setLoadingSavedMethods(true);
        console.log("Loading saved payment methods for user ID:", userId);
        try {
            // Directly fetch the user's payment info, which includes the paymentMethodId
            const { data: paymentInfo } = await axios.get(`http://localhost:8080/api/paymentinfo/${userId}`);
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
            setLoadingSavedMethods(false);
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

        // Construct the payload to send to your backend
        const paymentPayload = {
            amount: 1099, // Example amount, should be dynamically set based on the actual order
            saveCard, // Indicates whether the user has opted to save the card
            paymentMethodId, // The ID of the new or existing payment method
            userId, // The user's ID, dynamically set
        };

        try {
            // Call your backend to create the PaymentIntent and optionally save the card
            const { data: paymentIntentResponse } = await axios.post('http://localhost:8080/api/payments/charge', paymentPayload);

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
                };

                // Send the order creation request
                const orderResponse = await axios.post('http://localhost:8080/api/orders/placeOrder', orderRequest);
                console.log('Order created successfully:', orderResponse.data);
            }
        } catch (error) {
            console.error('Error during the payment or order creation process:', error);
        }
    };
    if (paymentSuccess) {
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
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!stripe}>
                        Pay
                    </Button>
                </form>
            </Box>
        );
    }
};

export default CheckoutForm;