"use client";

import React from 'react'

import { Menu} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from '@/components/sidebar';

import { useState , useEffect } from 'react';

const MobileSidebar = ({apiLimitCount = 0} : {apiLimitCount: number}) => {

    //to avoid hydration error
    const [isMounted , setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

  return (

    <Sheet>
        <SheetTrigger>

            <Button variant="ghost" size="icon" className=' md:hidden'>
                <Menu/>
            </Button>

        </SheetTrigger>
        <SheetContent side="left" className=' p-0'>
            <Sidebar apiLimitCount={apiLimitCount} />
        </SheetContent>
    </Sheet>
            
  )
}

export default MobileSidebar