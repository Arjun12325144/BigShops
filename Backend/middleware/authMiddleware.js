//this file contains middleware that protect routes 
const jwt = require("jsonwebtoken")
const User = require("../models/user")


//middleware to protect routes
const protect = async (req,res,next) =>{
    let token;
    if(req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer ")){
            try{
                token = req.headers.authorization.split(" ")[1];
                 console.log("Token received:", token);
                const decoded = jwt.verify(token , process.env.JWT_SECRET);
                req.user = await User.findById(decoded.user.id).select("-password");
                next(); 
            }
            catch(err){
                console.error("Token Verification failed: ",err);
                res.status(401).json({message:"Not authorized"});

            }
        }
        else{
            res.status(401).json({message:"Not authorised, no taken provided"})
        }
    
}


//middleware to check is user is an admin
const admin = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({message:"Not authorised as an admin"})
    }
}

module.exports = {protect, admin}