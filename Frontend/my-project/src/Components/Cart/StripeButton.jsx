import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RNzqWPswmYBrwp7c3Bnivr4mG8VURYeRFp71BFdXtdNVgm7sFuSeOz7yQ6Tei2HmPAj3fQPTaxDjH0bcX8xVX3k008hmboG7s'); // Replace with your Stripe public key

const CheckoutForm = ({ amount, onSuccess, onError }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name || !email) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            // Simulate a successful payment
            console.log('Simulating payment...');
            setTimeout(() => {
                const dummyPaymentIntent = {
                    id: 'pi_dummy12345',
                    status: 'succeeded',
                };
                console.log('Payment successful:', dummyPaymentIntent);
                onSuccess(dummyPaymentIntent); // Trigger the success callback
            }, 1000); // Simulate a 1-second delay
        } catch (err) {
            console.error('Payment failed:', err);
            onError(err); // Trigger the error callback
        }
    };

    return (
        <div>
            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your name"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Card Details</label>
                <CardElement className="p-2 border rounded" />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={handleSubmit} // Simulate payment on button click
                className="w-full bg-black text-white py-3 rounded mt-4"
            >
                Pay ${amount}
            </button>
        </div>
    );
};

const StripeButton = ({ amount, onSuccess, onError }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
};

export default StripeButton;