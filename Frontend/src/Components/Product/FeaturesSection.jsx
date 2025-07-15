import React from 'react'
import { FaShoppingBag } from "react-icons/fa";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { AiOutlineCreditCard } from "react-icons/ai";

const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
        <div className='grid grid-cols-1 md:grid-cols-3 mx-auto gap-8 text-center'>
            {/* feature 1 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'><FaShoppingBag className='text-xl'/></div>
                <h4 className='tracking-tighter mb-2'>FREE INTERNATIONAL SHIPPING</h4>
                <p className='text-sm tracking-tighter text-gray-600'>
                    On all orders over $100.00
                </p>
            </div>

            {/* feature 2 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'><HiArrowPathRoundedSquare className='text-xl'/></div>
                <h4 className='tracking-tighter mb-2'>45 DAYS RETURN</h4>
                <p className='text-sm tracking-tighter text-gray-600'>
                    Money back guarntees
                </p>
            </div>

            {/* feature 3 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'><AiOutlineCreditCard  className='text-xl'/></div>
                <h4 className='tracking-tighter mb-2'>SECURE CHECKOUT</h4>
                <p className='text-sm tracking-tighter text-gray-600'>
                    100% secure checkout process
                </p>
            </div>
            
        </div>
    </section>
  )
}

export default FeaturesSection
