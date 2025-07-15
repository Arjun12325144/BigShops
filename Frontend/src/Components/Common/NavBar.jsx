import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { CiMenuFries } from "react-icons/ci";
import Search from './Search';
import CartDrawer from '../Layout/CartDrawer';
import {useSelector, useDispatch} from "react-redux";
const NavBar = () => {
  const [drawerOpen, setdrawerOpen] = useState(false);
  const[navDrawerOpen,setnavDrawerOpen]  = useState(false);

  const {cart} =useSelector((state)=>state.cart);
  const {user} =useSelector((state)=>state.auth);
  const cartItemCount = 
    cart?.products?.reduce((total,product)=> total + product.quantity, 0) || 0;

  const toggleCartDrawer = ()=>{
    setdrawerOpen(!drawerOpen);
  }
  const toggleNav = ()=>{
    setnavDrawerOpen(!navDrawerOpen);
  }

  return (
    <>
      <nav className='flex items-center justify-between px-6 py-4 '>
        {/*Left Logo*/}
        <div>
          <Link to="/" className='text-2xl font-medium'>Rabbit</Link>
        </div>
        {/*Center navigation links*/}
        <div className='hidden md:flex gap-3'>
          <Link to="/collections/all?gender=Women" className='text-zinc-500 text-sm font-medium hover:text-black'>Women</Link>
          <Link to="/collections/all?gender=Men" className='text-zinc-500 text-sm font-medium hover:text-black'>Men</Link>
          <Link to="/collections/all?category=Top Wear" className='text-zinc-500 text-sm font-medium hover:text-black'>Top Wear</Link>
          <Link to="/collections/all?category=Bottom Wear" className='text-zinc-500 text-sm font-medium hover:text-black'>Bottom Wear</Link>
          
        </div>
         {/*right icons*/}
         <div className='flex items-center gap-4'>
          {user && user.role === "admin" && (
                 <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">Admin</Link>
          )}
         
          <Link to="/profile" className=' '><FaRegUser className='h-6 w-6 text-zinc-500 hover:text-black'/></Link>
          <button className='relative ' onClick={toggleCartDrawer}>
            <FaShoppingCart className='h-6 w-6 text-zinc-500 hover:text-black'/>
            {cartItemCount >0 && (<span className='absolute px-1.5 -top-1 text-white py-0.5   text-xs  bg-rabbit-red rounded-full'> {cartItemCount} </span>) }
            

          </button> 

          <Search/>
          <button   className='md:hidden' onClick={toggleNav}>
            <CiMenuFries className='h-6 w-6 text-zinc-500' />
            </button>
          {/* <Link to=""><CiSearch /></Link> */}
         </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
      {/* mobile navigation */}
      <div className={`fixed top-0 left-0 bg-white h-full w-3/4 sm:w-1/2 md:w-1/3 shadow-xl transform transition-transform duration-300 z-50
       ${navDrawerOpen? "translate-x-0" : "-translate-x-full"
       } `}>
        <div className='flex justify-end p-4' onClick={toggleNav}>
          <button><IoMdCloseCircle className='w-6 h-6 text-zinc-500 hover:text-black'/></button>
        </div>

        <div className='p-4'>
          <h1 className='mb-4'>Menu</h1>
          <nav className='space-y-4'>
            <Link to="/collections/all?gender=Men" onClick={toggleNav} className='block text-sm font-semibold text-zinc-500 hover:text-black'>Men</Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNav} className='block text-sm font-semibold text-zinc-500 hover:text-black'>Women</Link>
            <Link to="/collections/all?category=Top Wear" onClick={toggleNav} className='block text-sm font-semibold text-zinc-500 hover:text-black'>Top Wear</Link>
            <Link to="/collections/all?category=Bottom Wear" onClick={toggleNav} className='block text-sm font-semibold text-zinc-500 hover:text-black'>Bottom Wear</Link>
          </nav>
        </div>
      </div>
    </>
  )
}

export default NavBar
