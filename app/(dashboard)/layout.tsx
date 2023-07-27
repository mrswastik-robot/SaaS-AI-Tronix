import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import { getApiLimitCount } from "@/lib/api-limit";
import { get } from "http";

const DashboardLayout = async ({ children } : {
    children: React.ReactNode;
}) => {

    const apiLimitCount = await getApiLimitCount();
    // we will be fetching this getApiLimitCount in the layout.tsx file which is a server component because we can only access prisma from a server component
    //then from layout.tsx we will send it as a prop to <Sidebar /> component which is a client component and then we will show the loader in the sidebar with the current api used count
    //3:28

    return(
        <div className=" h-full relative">
            <div className=" hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar apiLimitCount={apiLimitCount}/>
            </div>

            <main className=" md:pl-72">
                <Navbar/>
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;