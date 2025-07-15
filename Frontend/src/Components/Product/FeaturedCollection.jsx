import React from 'react'
import { Link } from 'react-router-dom'
import featured from "../../assets/featured.webp"
function FeaturedCollection() {
  return (
     <section className='py-16 px-4 lg:px-8'>
        <div className='flex flex-col-reverse mx-auto lg:flex-row items-center bg-green-50 rounded-3xl'>
             {/* left part */}
             <div className='lg:w-1/2 p-8 text-center lg:text-left'>
                <h1 className='text-lg font-semibold mb-2 text-gray-700'>Comfort and Styles</h1>
                <h2 className='text-4xl lg:text-5xl mb-6'>Apparel made for your everyday life.</h2>
                <p className='text-gray-600 text-lg mb-6'>
                    Discover high quality, comfortable clothing that effortlessly blends fashion and function. Designed to make you look great feel everyday.
                </p>
                <Link to="/collections/all" className='bg-black text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-800'>Shop Now</Link>
             </div>
            {/* right part */}
            <div className='lg:w-1/2'>
            <img src={featured} alt="" className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl' />
            </div>
        </div>
     </section>
  )
}

export default FeaturedCollection
