import React from 'react'
import TopBar from '../Layout/TopBar'
import NavBar from './NavBar'
const Header = () => {
  return (
     <header className='border-b border-zinc-300'>
        {/*topbar*/}
        < TopBar/>
        {/*navbar*/}
        <NavBar/>
        {/*cart*/}
     </header>
    
  )
}

export default Header

