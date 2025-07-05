import React, { useState } from 'react'
import { Form } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { HiMiniXCircle } from "react-icons/hi2";
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom';
import {fetchProductByFilters} from "../../redux/slices/productSlice"
import {setFilters} from "../../redux/slices/productSlice"
const Search = () => {
    const [SearchTerm , setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSearchToggle = ()=>{
        setIsOpen(!isOpen);
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        // console.log("Search: ",SearchTerm);
        dispatch(setFilters({search: SearchTerm}));
        dispatch(fetchProductByFilters({search : SearchTerm}))
        navigate(`/collections/all?search=${SearchTerm}`)
        setIsOpen(false);
    }
  return (
    <div className={`flex items-center justify-center w-full transition-all duration-30 ${isOpen ?" absolute top-0 left-0 w-full h-24 bg-white": "w-auto"}  `}>
       {isOpen? (
        <form className='relative flex items-center justify-center w-full  ' onSubmit={handleSubmit}>
            <div className='relative w-1/2'>
                <input type="text" placeholder='Search' value={SearchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className='w-full bg-zinc-200 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none'/>
                <button type='submit' className='absolute right-2 top-2 '><CiSearch className='w-6 h-6 text-zinc-500 hover:text-black font-bold'/></button>
            </div>
            {/* close button */}
            <button className='absolute right-2 top-2' onClick={handleSearchToggle}>
                <HiMiniXCircle className='w-6 h-6 text-zinc-700 hover:text-black font-bold'/>
                </button>
        </form>
    ):(
        <button onClick={handleSearchToggle}>
            <CiSearch className='w-7 h-7 text-zinc-500 hover:text-black font-bold'/>
        </button>
    )}
    </div>
  )
}

export default Search
