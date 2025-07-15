import React from 'react' 
import heroImg from "../../assets/rabbit-hero.webp";
import { Link } from 'react-router-dom';
function Hero() {
  return (
    <section className='relative'>
    
        <img src={heroImg} alt="" className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover'/>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white'>
            <h1 className='text-4xl  md:text-9xl tracking-tighter uppercase mb-4'>Vacation <br />Ready </h1>
            <p className='mb-6 text-sm md:text-lg tracking-tighter'>Explore our vacation-ready outfit with fast worlswide shipping</p>
            <Link to="/collections/all" className='bg-white text-gray-900 px-6 py-2 rounded-sm text-sm'>Shop Now</Link>
          </div>
        </div>
    </section>
  )
}

export default Hero
