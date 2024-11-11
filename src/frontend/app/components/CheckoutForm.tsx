// components/CheckoutForm.tsx
'use client';

import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Stripe.js has not loaded yet.');
            return;
        }

        const cardElement = elements.getElement(CardElement) as StripeCardElement | null;

        if (!cardElement) {
            setErrorMessage('Could not find Card Element.');
            return;
        }

        setIsProcessing(true);

        // Fetch the client secret from the backend
        const res = await fetch('http://localhost:3001/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000 }), // Replace with actual amount
        });

        const { clientSecret } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        console.log(result.paymentIntent)

        if (result.error) {
            setErrorMessage(result.error.message || 'An unexpected error occurred.');
        } else if (result.paymentIntent?.status === 'succeeded') {
            alert('Payment successful!');
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <CardElement />
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                {isProcessing ? 'Processing…' : 'Pay'}
            </button>
            {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </form>
    );
};

export default CheckoutForm;
