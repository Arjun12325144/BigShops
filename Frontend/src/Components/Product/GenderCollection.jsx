import React from 'react'
import Menscoll from "../../assets/mens-collection.webp";
import womenscoll from "../../assets/womens-collection.webp";
import { Link } from 'react-router-dom';
function GenderCollection() {
  return (
   <section className='py-16 px-4 lg:px-2'>
        <div className='flex flex-col md:flex-row gap-8 mx-auto'>
            {/* men coll */}
            <div className='relative flex-1'>
                <img src={Menscoll} alt="" className='w-full h-[700px] object-cover'/>
                <div className='absolute bottom-8 left-8 bg-white p-4 bg-opacity-90'>
                    <h2 className='text-2xl font-bold mb-3 text-gray-900'>Men's Collection</h2>
                    <Link to="/collections/all?gender=Men" className='text-gray-900 underline'>Shop Now</Link>
                </div>
            </div>
            {/* women coll */}
            <div className='relative flex-1'>
                <img src={womenscoll} alt="" className='w-full h-[700px] object-cover'/>
                <div className='absolute bottom-8 left-8 bg-white p-4 bg-opacity-90'>
                    <h2 className='text-2xl font-bold mb-3 text-gray-900'>Women's Collection</h2>
                    <Link to="/collections/all?gender=Women" className='text-gray-900 underline'>Shop Now</Link>
                </div>
            </div>
        </div>
   </section>
  )
}

export default GenderCollection
