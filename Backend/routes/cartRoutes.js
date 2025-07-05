const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {protect} = require("../middleware/authMiddleware")
const router = express.Router();



//helper funciton to get cart by user or guest id
const getCart = async (userId,guestId)=>{
    if(userId){
       return  await Cart.findOne({user:userId});
    }
    else if(guestId){
        return await Cart.findOne({guestId})
    }
    return null;
}
//route POST /api/cart
// add aproduct to the cart for a guest or logged in user
//access public
router.post("/", async (req,res)=>{
    const{
        productId,quantity,size,color,guestId,userId
    } = req.body;

    try{
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message:"Product not found"});

        // determine if user is logged in or user
        let cart = await getCart(userId,guestId);

        //if cart exists , update it

        if(cart){
            const productIndex = cart.products.findIndex(
                (p)=>
                    p.productId.toString() === productId && 
                p.size === size && 
                p.color === color
                );
                if(productIndex > -1){
                    // if product already exists , update quantity
                    cart.products[productIndex].quantity += quantity; 
                }else{
                    // add new product
                    cart.products.push({
                        productId,
                        name:product.name,
                        image:product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    })

                }
                //recalcuate the total price
                cart.totalPrice = cart.products.reduce((acc,item) => acc+ item.price * item.quantity,0);
                await cart.save();
                return res.status(200).json(cart);

         }
         else{
            // create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId :  "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name:product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice:product.price * quantity,
            });
            return res.status(201).json(newCart)
         }
    }catch(err){
        console.error(err);
        res.status(500).json({message: "server error"})
    }
})


// route PUT /apk/cart
//update product quantity int he cart for a guest or logged in user
//access public

router.put("/", async (req,res)=>{
    const {productId,quantity,size,color,guestId,userId} = req.body;
    try{
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message: "cart not found"});

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString()=== productId &&
                p.size === size && 
                p.color===color
        );
        if(productIndex > -1){
            // update product
            if(quantity >0){
                cart.products[productIndex].quantity = quantity;
            }
            else{
                cart.products.splice(productIndex,1); // remove product if quantity is 0
            }
            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity,0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else{
            return res.status(404).json("product not found");
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: "Server Error"})
    }
})


//route DELETE /api/cart
// desc remove a product from thr cart
// access public

router.delete("/", async (req,res)=>{
    const {productId,size,color,guestId,userId} = req.body;
    try{
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(200).json({message:"cart not found"})

        let productIndex = cart.products.findIndex(
            (p) => 
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        )
        if(productIndex>-1){
            cart.products.splice(productIndex,1);
            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity,0
            );
            await cart.save();
            return res.status(200).json(cart);
        }
        else{
            return res.status(404).json({message:"product not found in cart"})
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"server error"})

    }
})

//route GET /api/cart
//desc get logged in user's or guest user's cart
//public
router.get("/", async (req,res)=>{
    const {userId,guestId} = req.query;
    try{
        const cart = await getCart(userId,guestId);
        if(cart){
            res.json(cart)
        }
        else{
            res.status(404).json({message: "Cart not found"})

        }

    }
    catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"});
    }
})


//route POST /api/cart/merge
// merge guest cart into usser cart
// access private

router.post("/merge",protect, async (req,res)=>{
    const {guestId} = req.body;
      const userId = req.user._id;
    try{
        // find the guest cart and user cart
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({user: userId}); 
        if(guestCart){
            if(guestCart.products.length === 0){
                return res.status(404).json({message:"Guest cart is empty"})
            }
            if(userCart){
                //merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex = userCart.products.findIndex(
                        (item)=>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color

                    )
                    if(productIndex > -1){
                        //if the item exists in the user cart, update quantity
                        userCart.products[productIndex].quantity +=quantity;
                    }
                    else{
                        //otherwise add the guest item to cart
                        userCart.products.push(guestItem);
                    }
                })
                userCart.totalPrice = userCart.products.reduce((acc,item)=>acc + item.price * item.quantity,0)
                await userCart.save();

                //remove the guest cart after merging

                try{
                    await Cart.findOneAndDelete({guestId});
                }catch(err){
                    console.error("Error deleting this cart",err)
                }
                res.status(200).json(userCart);
             }
            else{
                // if the user has not existing cart,  assign the guest cart to user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart)
            }
        }else{
            if(userCart){
                //guest cart has already been merged , return user cart
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"guest cart not found"})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message: "server error"})
    }
})

module.exports = router;