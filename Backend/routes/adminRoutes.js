const express = require("express");
const User = require("../models/user");
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router();

// route GET/admin/users
// desc get all users(admin only);
// access private
router.get("/",protect, admin, async (req,res)=>{
    try{
        const users = await User.find({});
        res.json(users);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error"});
    }
})

//POST /api/admin/user
// add a new user (admin only)
//access private/admin
router.post("/",protect , admin, async (req,res)=>{
    const {name, email, password, role} = req.body;
    try{
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({message:"User already exists",user});
        }
        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        });
        await user.save();
        res.status(201).json({message:"User created successfully!", user})
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
})

//route /api/admin/user/:id
//desc update user info (admin only)-> name,emial,role
// access priveta/admin
router.put("/:id",protect, admin, async (req,res)=>{
    try{
        const user =await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({message: "User updated successfully", user: updatedUser});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
})

// route DELETE /api/admin/users/:id
// desc delete a user
//access private/admin

router.delete("/:id",protect, admin , async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"User deleted successfully"});
        }
        else{
            res.status(404).json({message:"User not found"});
        }

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
})

module.exports = router;