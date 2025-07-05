const express = require("express");
const Checkout = require("../models/Checkout")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const Order = require("../models/Order") 
const {protect} = require("../middleware/authMiddleware")

//route /api/checkout
// create a new checkout session
// access private
const router = express.Router()

router.post("/",protect,async (req,res)=>{
    const {checkoutItems,shippingAddress,paymentMethod,totalPrice} = req.body;
    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({message:"no item in checkout"})
    }

    try{
        //create a new checkout session
        const newCheckout = await Checkout.create({
            user:req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:"false",
        });
        console.log(`checkout created for user: ${req.user._id}`);
        res.status(200).json(newCheckout);
    }
    catch(err){
        console.error("Error creating checkoutSession: ",err);
        res.status(500).json({message:"server error"});

    }
})

//route PUT /api/checkout/:id/pay
// update checkout to mark as paid after successful payment
// access Private
router.put("/:id/pay",protect,async (req,res)=>{
    const {paymentStatus,paymentDetails} = req.body;
    try{
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(400).json({message:"checkout not found"});
        }
        if(paymentStatus === "paid"){
            checkout.isPaid = true,
            checkout.paymentDetails = paymentDetails,
            checkout.paymentStatus = paymentStatus,
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json({checkout});
        }else{
            res.status(400).json({message:"Invalid payment Status"})
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
})

//route POST /api/checkout/:id/finalize
// finalize checkout and convert to an order after payment confirmation
// access private

router.post("/:id/finalize",protect,async (req,res)=>{
    try{
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"});
        }
        if(checkout.isPaid && !checkout.isFinalized){
            //create final order based on checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt:checkout.paidAt,
                isDelivered: false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails,
            });
            //mark the checkout as finalized
            checkout.isFinalized=true,
            checkout.finalizedAt = Date.now();
            await checkout.save();
            // delete the cart associated with the user
            await Cart.findOneAndDelete({user: checkout.user});
            console.log("Final order being sent:", finalOrder);
            res.status(201).json({finalOrder});
        }
        else if(checkout.isFinalized){
            res.status(400).json({message:"Checkout already finalized"});
        }else{
            res.status(400).json({message:"Checkout is not paid"})
        }

    }catch(err){
        console.error(err)
        res.status(500).json({message:"Serve rError"})
    }
})

module.exports = router;