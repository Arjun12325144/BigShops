// // StripeButton.jsx
// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import axios from "axios";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Use from .env

// const CheckoutForm = ({ amount, onSuccess, onError }) => {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [clientSecret, setClientSecret] = useState(null);
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const createPaymentIntent = async () => {
//             try {
//                 const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-payment-intent`, {
//                     amount,
//                 });
//                 setClientSecret(data.clientSecret);
//             } catch (err) {
//                 console.error("Failed to create payment intent", err);
//             }
//         };
//         createPaymentIntent();
//     }, [amount]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         if (!stripe || !elements || !clientSecret) return;

//         const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//             payment_method: {
//                 card: elements.getElement(CardElement),
//                 billing_details: {
//                     name,
//                     email,
//                 },
//             },
//         });

//         if (error) {
//             console.error(error);
//             setError(error.message);
//             onError(error);
//         } else if (paymentIntent && paymentIntent.status === "succeeded") {
//             onSuccess(paymentIntent);
//         }

//         setLoading(false);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//                 <label className="block text-gray-700">Name</label>
//                 <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700">Email</label>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700">Card Details</label>
//                 <CardElement className="p-2 border rounded" />
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//             <button
//                 type="submit"
//                 className="w-full bg-black text-white py-3 rounded mt-4"
//                 disabled={!stripe || loading}
//             >
//                 {loading ? "Processing..." : `Pay $${amount}`}
//             </button>
//         </form>
//     );
// };

// const StripeButton = ({ amount, onSuccess, onError }) => (
//     <Elements stripe={stripePromise}>
//         <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
//     </Elements>
// );

// export default StripeButton;

// RazorpayButton.jsx
import React from "react";
import { useRazorpay } from "react-razorpay";
import axios from "axios";

const RazorpayButton = ({ amount, onSuccess, onError, user }) => {
  const { Razorpay, isLoading, error } = useRazorpay();

  const handlePayment = async () => {
    try {
      const orderRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, {
        amount,
      });
      const { id: order_id, amount: amt, currency } = orderRes.data;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amt,
        currency,
        order_id,
        name: "Arjun",
        description: "Order Payment",
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`,
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#000000" },
        handler: async (res) => {
          try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`, {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            });
            onSuccess(res);
          } catch (verErr) {
            onError(verErr);
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      onError(err);
    }
  };

  if (error) return <p>Error loading payment gateway</p>;

  return (
    <button
      disabled={isLoading}
      onClick={handlePayment}
      className="w-full bg-black text-white py-3 rounded mt-4"
    >
      {isLoading ? "Loading..." : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayButton;
