const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// route GET /api/orders/my-orders
//desc get logged in users's orders
// access private
router.get("/my-orders",protect, async (req,res)=>{
    try{
        // find orders for authenticated user
        const orders = await Order.find({user:req.user._id}).sort({
            createdAt:-1,
        })// sort by most recent orders
        res.json(orders);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});

    }
})


//route get /api/orders/:id
// desc get order details by id
//access private
router.get("/:id",protect, async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id).populate("user","name email");
    
        if(!order){
            return res.status(404).json({message:"Orders not found"})
        }
        res.json(order);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
    //retunr the full order details

})

module.exports = router;