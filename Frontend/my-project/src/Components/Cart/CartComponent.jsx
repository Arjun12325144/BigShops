import React from 'react'
import { MdDelete } from "react-icons/md";
import {useSelector, useDispatch} from "react-redux";
import {removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice" 
const CartComponent = ({cart, userId, guestId}) => {
  const dispatch = useDispatch();
  //handle adding or sub to cart
  const handleAddToCart = (productId, delta, quantity, size, color)=>{
    const newQuantity = quantity + delta;
    if(newQuantity >=1){
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size, 
          color,
        })
      )
    }
  }

  const handleRemoveFromCart = (productId, size,color) =>{
      dispatch(removeFromCart({productId, guestId, userId, size, color}))
  }
  return (
    <div>
      { cart.products.map((product,index)=>(
       <div key={index} className='  py-4 border-b flex items-start justify-between'>
           <div className='flex items-start'>
          <img src={product.image} alt={product.name} className='h-24 w-20 object-cover mr-4 rounded' />
        <div>
          <h3 className=''>{product.name}</h3>
          <p className='text-sm text-zinc-500'>size: {product.size} | color: {product.color}</p>
          <div className='  mt-2'>
            <button 
            onClick={()=>
              handleAddToCart(
                product.productId,1,product.quantity,product.size, product.color
              )
            } 
            className='mr-2 ml-2 border py-1 px-2 rounded text-xl font-medium'>+</button>
            <span>{product.quantity}</span>
            <button 
            onClick={()=>
              handleAddToCart(
                product.productId,-1,product.quantity,product.size, product.color
              )
            } 
            className='mr-2 ml-2 border py-1 px-2 rounded text-xl font-medium'>-</button>
          </div>
        </div> 
           </div>


           <div className='flex flex-col items-center'>
            <h1>$ {product.price.toLocaleString()}</h1>
            <button 
            onClick={()=>
              handleRemoveFromCart(
                product.productId,
                product.size, 
                product.color
              )
            }
            ><MdDelete  className='h-6 w-6 text-red-300 hover:text-red-600'/></button>
           </div>
       </div> 

      ))}
    </div>
  )
}

export default CartComponent
