// // routes/payment.js
// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // use your secret key

// router.post("/create-payment-intent", async (req, res) => {
//     const { amount } = req.body;

//     if (!amount) {
//         return res.status(400).json({ error: "Amount is required" });
//     }

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // convert to cents
//             currency: "usd",
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });

//         res.send({
//             clientSecret: paymentIntent.client_secret,
//         });
//     } catch (err) {
//         console.error("Stripe error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
// routes/razorpay.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// STEP 1: Create Razorpay Order
router.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const options = {
        amount: amount * 100, // Razorpay needs amount in paise
        currency: "INR",
        receipt: `rcptid_${Math.floor(Math.random() * 10000)}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error("Razorpay order error:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// STEP 2: Verify Payment Signature
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (generated_signature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});

module.exports = router;
