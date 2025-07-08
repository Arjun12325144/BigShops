const express = require("express");
const Order  = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();
//GET  /api/admin/orders
//desc get all order (admin only)
// access private/admin
router.get("/",protect, admin,async (req,res)=>{
    try{
         const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
   
})

// @route /api/admin/orders/:id
// desc update order status
// access private/admin
router.put("/:id",protect, admin, async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id).populate("user", "name");
        if(order){
            order.status = req.body.status || req.status;
            order.isDelivered = 
                req.body.status === "Delivered"?true : order.isDelivered;
            order.deliveredAt = 
                req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
    
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }else{
            res.status(401).json({message: "Order not found"})
        }

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});

    }
})

// route DELETE /api/admin/orders/:id
// desc delete an order
//acess private / admin
router.delete("/:id",protect, admin, async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message:"Order removed"});
        }
        else{
            res.status(404).json({message:"Order not found"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
})

module.exports = router;