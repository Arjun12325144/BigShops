import React from 'react'
import { FaMeta } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
const TopBar = () => {
  return (
    <div className='bg-rabbit-red text-white'> 
        <div className='container mx-auto flex items-center justify-between py-3 px-4 '> 
            <div className='hidden md:flex gap-[1.3vw] items-center'>
                <a href="#" className='hover:text-grey-200'>< FaMeta className='h-5 w-5'/></a>
                <a href="#" className='hover:text-grey-200'><FaInstagram className='h-5 w-5'/></a>
                <a href="#" className='hover:text-grey-200'><FaTwitter className='h-5 w-5'/></a>
            </div>
            <div className='text-sm text-center flex-grow '><span >We ship worldwide - Fast and reliable spipping!</span></div>
            <div className='hidden md:block  text-sm hover:text-gray-300'><a href="tel: 8630766956">91+ 8630766956</a></div>
        </div>
    </div>
  )
}

export default TopBar
