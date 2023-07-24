import React from 'react'
// import { Button } from './ui/button';
// import { Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import MobileSidebar from './mobile-sidebar';

const Navbar = () => {
  return (
    <div className=' flex items-center p-4'>
        {/* <Button variant="ghost" size="icon" className=' md:hidden'>
            <Menu/>
        </Button> */}

        <MobileSidebar/>


        <div className=' flex w-full justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>

    </div>
  )
}

export default Navbar;