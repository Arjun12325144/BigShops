import React, {useEffect} from 'react'
import MyOrdersPage from './myOrdersPage'
import { useDispatch , useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../redux/slices/authSlice"
import {clearCart} from "../redux/slices/cartSlice"
function Profile() {
    const { user } = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!user){
            navigate("/login");
        }
    },[user,navigate])
    const handlelogout = ()=>{
        dispatch(logout());
        dispatch(clearCart())
        navigate("/login")
    }
  return (
    <div className='min-h-screen flex flex-col'>
        <div className='p-4 md:p-6 container flex-grow mx-auto'>
            <div className='flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0'>
                {/* left part */}
                <div className='w-full md:w-1/3 lg:w-1/4  shadow-md rounded-lg p-6 '>
                    <h1 className='text-2xl md:text-3xl font-bold mb-4'>{user?.name}</h1>
                    <p className='text-lg text-gray-600 mb-4'>{user?.email}</p>
                    <button onClick={handlelogout} className='bg-red-500 rounded hover:bg-red-600 text-white px-4 py-2 w-full'>Logout</button>
                </div>
                {/* right part */}
                <div className='w-full h-9   md:w-2/3 lg:w-3/4'>
                    <MyOrdersPage />
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Profile
