import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import CartComponent from '../Cart/CartComponent';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  const navigate = useNavigate();
  const {user, guestId} = useSelector((state)=>state.auth)
  const {cart} = useSelector((state)=>state.cart)
  const userId = user ? user._id : null;
  const handleCheckoutButton = ()=>{
    toggleCartDrawer();
    if(!user){
        navigate("/login?redirect=checkout")
    }
    else{
        navigate("/checkout");
    }
  }
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-2xl transform
        transition-transform duration-300 flex flex-col z-50
        ${drawerOpen ? "translate-x-0" : "translate-x-full" 
        }`}>
            
        {/* close button */}
        <div className='flex justify-end p-4'>
            <button onClick={toggleCartDrawer}>
            <IoMdCloseCircle className='w-6 h-6 text-zinc-500 hover:text-black'/>
            </button>
        </div>
        {/* card containt with scroll area */}
        <div className='flex-grow p-4 overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Your cart</h2>
            {/* Components for cart  */}
            {cart && cart?.products?.length > 0 ? (<CartComponent cart={cart} userId={userId} guestId= {guestId} />):(
              <p>Your cart is empty.</p>
            )}

            
        </div>


        {/* checkout button fixes at bottom */}
        <div className='   absolute w-full bg-white p-4 bottom-0'>
          {cart && cart?.products?.length > 0 && (
            <>
                <button onClick={handleCheckoutButton} className='bg-black w-full py-3 rounded-lg font-semibold text-white'>Checkout</button>
                <p className='texy-sm  mt-2 tracking-tighter text-center'>Shipping, taxes and discounts are calculated in checkout</p>
            </>
          )}
        </div>
    </div>
  )
}

export default CartDrawer
