import React from 'react'
import { FaMeta } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";

import { FaXTwitter } from "react-icons/fa6";

import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer className='border-t py-12'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
            <div>

            <h3 className='text-lg text-gray-800 mb-3'>Newsletter</h3>
            <p className='text-gray-500 mb-2'>Be the first to hear about new products, exclusive events, and online offers</p>
            <p className='font-medium text-sm text-gray-600 mb-6'>Sign up and get 10% off your first orser.</p>
            {/* newsletter from */}
            <form action="" className='flex'>
                <input type="email" placeholder='Enter your email'
                  className='p-3 w-full text-sm border-t border-l border-b 
                  border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all' />
                  <button type='submit' className='transition-all bg-black hover:bg-gray-700 text-white rounded-tr-lg rounded-br-lg'>Subscribe</button>
            </form>
            </div>
            {/* shop links */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
                <ul className='space-y-2 text-gray-500'>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Mens's top Wear</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Womens's top Wear</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Mens's bottom Wear</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Women's bottom Wear</Link></li>
                </ul>
            </div>
            {/* support links */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
                <ul className='space-y-2 text-gray-500'>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >About Us</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Contact US</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >FAQ's</Link></li>
                    <li className='hover:text-gray-900'><Link to='#' className='h transition-colors' >Feature</Link></li>
                </ul>
            </div>
            {/* follow us */}
            <div>
                <h1 className='text-gray-800 mb-4 text-lg'>Follow Us</h1>
                <div className='flex items-center space-x-4 mb-4'>
                    <a href="www.facebook.com"><FaMeta className='h-6 w-6 text-gray-500 hover:text-gray-900 transition-colors'/></a>
                    <a href="www.instagram.com"><FaInstagram className='h-6 w-6 text-gray-500 hover:text-gray-900 transition-colors'/></a>
                    <a href="www.Twitter.com"><FaXTwitter className='h-6 w-6 text-gray-500 hover:text-gray-900 transition-colors'/>
                    </a>
                </div>
                <p className='text-lg text-gray-800'>Call us</p>
                <p><FiPhoneCall  className=' inline-block mr-2'/>
                1234-5678
                </p>
            </div>
        </div>
        {/* footer bottom */}
        <div className='  mt-8 px-4 lg:px-0 border-t border-zinc-500 pt-5'>
            <p className='text-gray-500 text-center tracking-tighter'>&copy; 2025, ArjunRajput, All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer
