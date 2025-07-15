import React, { useEffect, useRef, useState } from 'react'
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";
function NewArrivals() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft,setScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

  
const [newArrivals, setNewArrivals] = useState([]);
useEffect (()=>{
    const fetchNewArrivals = async ()=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
            setNewArrivals(response.data)
        }
        catch (err){
            console.error(err)
        }
    }
    fetchNewArrivals();
},[])

    const scroll = (direction) =>{
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({left: scrollAmount, behaviour:"smooth"});
    }
    //update scroll button
    const updateScrollButton = ()=>{
        const container = scrollRef.current;
        if(container){
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            setCanScrollLeft(leftScroll>0);
            setCanScrollRight(rightScrollable);
        }
        
    }
    useEffect(()=>{
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll",updateScrollButton);
            updateScrollButton();
        }
    },[newArrivals])
  return (
    <section>
        <div className='container text-center mx-auto mb-10 relative'>
            <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
            <p className='text-lg text-gray-600 mb-8'>Discover the latest styles straight off the runway, freshly added to
                keep your wardrobe on the cutting edge of fashion
            </p>
            {/* scroll buttons */}
             <div className='absolute bottom-[-30px] right-0 flex space-x-2'>
                <button onClick={()=> scroll("left")} className={`p-2 rounded border ${canScrollLeft ?"bg-white text-black":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}><FaChevronLeft className='text-2xl'/></button>
                <button onClick={()=> scroll("right")} className={`p-2 rounded border ${canScrollRight ?"bg-white text-black":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}><FaChevronRight className='text-2xl'/></button>
            </div> 
        </div>
        {/* scrollable content */}
        <div ref={scrollRef}     className='container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide'>
            {newArrivals.map((product) => (
                <div key={product._id} className='relative min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] '>
                    <img src={product.images[0]?.url} alt={product.images[0]?.altText || product.name} className='w-full h-[400px] object-cover rounded-lg' draggable="false"/>
                    <div className='absolute bottom-0 right-0 left-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg'>
                        <Link to={`/products/${product._id}`} className='block'>
                            <h4 className='font-medium'>{product.name}</h4>
                            <p className='mt-1'>{product.price}</p>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals
