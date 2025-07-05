const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv")

const app = express();
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const productRoutes  = require("./routes/productRoutes")
const cartRoutes  = require("./routes/cartRoutes")
const checkoutRoutes  = require("./routes/checkoutRoutes")
const orderRoutes  = require("./routes/orderRoutes")
const uploadRoutes  = require("./routes/uploadRoutes") 
const subscribeRoutes = require("./routes/subscriberRoutes")
const adminRoutes  = require("./routes/adminRoutes") 
const productAdminRoutes  = require("./routes/productAdminRoutes") 
const adminOrderRoutes  = require("./routes/adminOrderRoutes") 
app.use(express.json());
app.use(cors());

dotenv.config();
console.log(process.env.PORT)
const PORT = process.env.PORT || 3000;

//connect mongoDB;
connectDB();

app.get("/",(req,res)=>{
    res.send("welcome to rabbit");
})


// API Routes
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', subscribeRoutes);

//admin
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

//This means that any incoming request whose 
// path starts with /api/users (e.g., /api/users/login, /api/users/register, /api/users/123) 
// will be handled by the userRoutes router.

app.listen(PORT,()=>{
    console.log(`server is running on  http://localhost:${PORT}`);
}
)
