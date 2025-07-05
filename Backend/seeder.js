const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/user");
const Cart = require("./models/Cart");
const products = require("./data/products")

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// function to seed data
const seedData = async ()=>{
    try{
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
         await Cart.deleteMany();

        // create a default admin user
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin",
        });

        //assign the default user id to each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product)=>{
            return {... product,user: userID}
        })

        // insert the products into database
        await Product.insertMany(sampleProducts);
        console.log("product data seeded successfuly");
        process.exit();
    }
    catch(err){
        console.error("Error seeding  the data",err);
        process.exit();
    }
};
seedData(); 