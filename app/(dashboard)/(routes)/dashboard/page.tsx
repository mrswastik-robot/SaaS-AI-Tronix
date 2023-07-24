import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function DashboardPage() {
  return (
    <div>
        <p className=' text-6xl'>Now you are in dashboard mf.</p>
        {/* <UserButton afterSignOutUrl='/'/> */}
    </div>    
    
  )
}
