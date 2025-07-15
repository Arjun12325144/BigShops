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
const paymentRoutes = require("./routes/payment");
app.use(express.json());
// app.use(cors());
// app.use(cors({
//   origin: 'https://big-shops-q9he.vercel.app', // your frontend Vercel domain
//   credentials: true  // only needed if you're using cookies / sessions
// }));
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true
}));



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
app.use('/api/payment', paymentRoutes);
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
