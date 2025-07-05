import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice"
import { useDispatch, useSelector } from "react-redux";

import { mergeCart } from "../redux/slices/cartSlice"
function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, guestId, loading}  = useSelector((state)=>state.auth);
    const {cart} = useSelector((state)=>state.cart);
    // check redirect parameter and check if its checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");
    useEffect(()=>{
        if(user){
            if(cart?.products.length > 0 && guestId){
                dispatch(mergeCart({guestId, user})).then(()=>{
                    navigate(isCheckoutRedirect? "/checkout":"/")
                })
            }
            else{
                navigate(isCheckoutRedirect? "/checkout":"/")
            }
        }
    },[user,guestId,cart,navigate,isCheckoutRedirect, dispatch])


    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(loginUser({ email, password }))
        // console.log("login",{email,password})
    }
  return (
    <div className='flex'>
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='w-full max-w-[448px]  bg-white p-8 rounded-lg border shadow-sm'>
                <div className='flex justify-center mb-6'>
                    <h2 className='text-sm font-medium'>Rabbit</h2>
                </div>
                <h2 className='font-bold text-2xl text-center mb-6'>
                    Hey there!
                </h2>
                <p className='text-center mb-6'>Enter your username and password to Login</p>
                {/* username div */}
                <div className='mb-4'>
                    <label className='font-semibold text-sm block mb-2'>Email</label>
                    <input type="email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='w-full rounded border p-2'
                    placeholder='Enter your email address' />
                </div>
                <div className='mb-4'>
                    <label className='font-semibold text-sm block mb-2'>Password</label>
                    <input type="password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className='w-full rounded border p-2'
                    placeholder='Enter your password' />
                </div>
                <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800'>{loading ? "loading..." : "Sign In"}</button>
                <p className='mt-6 text-center text-sm'>Don't have any account {" "} 
                    <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>Register</Link>
                </p>
            </form>
        </div>
        <div className='hidden md:block w-1/2 bg-gray-800'>
            <div className='h-full flex flex-col justify-center items-center'>
                <img src={login} alt="" className='h-[750px] object-cover w-full'/>
            </div>
        </div> 
    </div>
  )
}

export default Login
