import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage =()=>{
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {products: []};
}

//helper fun to save cart to local torage

const saveCartToStorage = (cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart));

}

// fetch cart for user or guest
export const fetchCart = createAsyncThunk ("cart/fetchCart",async({userId,guestId}, 
    {rejectWithValue}) =>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: {userId, guestId}
                }
            );
            return response.data;
        }
        catch(err){
            console.error(err);
            return rejectWithValue(err.response.data);
        }
    }
)

// add an item to the cart for a user or guest
export const addToCart  = createAsyncThunk("cart/addToCart",async ({productId,quantity,size,color,guestId,userId}, {rejectWithValue})=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId,
            }
        )
        return response.data

    }
    catch(err){
        return rejectWithValue(err.response.data)
    }
})

// update thw quantity of item in cart
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({productId,quantity,guestId,userId,size,color},
    {rejectWithValue})=>{
        try{
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    productId,
                    quantity,
                    guestId,
                    userId,
                    size,
                    color,
                }
            );
            return response.data;
        }
        catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

//remove an item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async({productId, guestId,userId,size,color},{rejectWithValue})=>{
    try{
        const response = await axios({
            method: "DELETE",
            url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: {productId, guestId, userId, size, color}
        })
        return response.data;
    }
    catch(err){
        return rejectWithValue(err.response.data)
    }
})
// merge guest car into user cart
export const mergeCart = createAsyncThunk("cart/mergeCart",async({user, guestId}, {rejectWithValue})=>{
    try{
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            {guestId, user},
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return response.data;
    }
    catch(err){
        return rejectWithValue(err.response.data)
    }
 })

 const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart: loadCartFromStorage(),
        loading:false,
        error:null,
    },
    reducers:{
        clearCart:(state)=>{
            state.cart = { products:[] };
            localStorage.removeItem("cart")
            // saveCartToStorage(state.cart);
        }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(fetchCart.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message || "Failed to fetch cart";
        })

        .addCase(addToCart.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message || "Failed to add a cart";
        })


        .addCase(updateCartItemQuantity.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Failed to update item quantity";
        })



        .addCase(removeFromCart.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Failed to remove item";
        })


        .addCase(mergeCart.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(mergeCart.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Failed to merge cart";
        })
    }
 })

 export const { clearCart } = cartSlice.actions
 export default cartSlice.reducer;