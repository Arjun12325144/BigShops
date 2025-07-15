import { configureStore }  from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkoutSlice"
import orderReducer from "./slices/orderSlice"
import amdinReducer from "./slices/adminSlice"
import amdinProductReducer from "./slices/adminProductSlice"
import amdinOrderReducer from "./slices/AdminOrderSlice"
const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer, 
        checkout:checkoutReducer,
        orders: orderReducer,
        admin: amdinReducer,
        adminProducts: amdinProductReducer,
        adminOrders :amdinOrderReducer,
    },
});

export default store;