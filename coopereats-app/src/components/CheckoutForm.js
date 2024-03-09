import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, Typography, Button, Box, Checkbox, FormControlLabel } from '@mui/material';
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
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSaveCardChange = (event) => {
        setSaveCard(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log('Stripe.js has not yet loaded.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
        } else {
            try {
                // use axios to call backend to create a Payment Intent
                const { data: paymentIntentResponse } = await axios.post('http://localhost:8080/api/payments/charge', {
                    amount: 1099, // needs to be passed from cart
                    saveCard: saveCard, // Whether to save the card, set by user
                    paymentMethodId: paymentMethod.id,
                    userId: 3, // should be dynamically set
                });

                // Confirm the payment on the frontend
                const confirmResult = await stripe.confirmCardPayment(paymentIntentResponse.clientSecret, {
                    payment_method: paymentMethod.id,
                });

                if (confirmResult.error) {
                    console.error(confirmResult.error);
                } else {
                    if (confirmResult.paymentIntent.status === 'succeeded') {
                        console.log('Payment succeeded!');
                        setPaymentSuccess(true);

                        // Use Axios to send request to create order once payment is succeeded
                        const orderRequest = {
                            userId: 3, // should be dynamically set
                            paymentIntentId: confirmResult.paymentIntent.id
                        };

                        await axios.post('http://localhost:8080/api/orders/placeOrder', orderRequest);
                        console.log('Order created successfully');
                    }
                }
            } catch (error) {
                console.error('Error during the payment or order creation process:', error);
            }
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
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!stripe}>
                        Pay
                    </Button>
                </form>
            </Box>
        );
    }
};

export default CheckoutForm;