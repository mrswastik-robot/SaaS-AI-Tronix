
import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";
//or can be written like this import prismadb from "@/lib/prismadb";'

import { MAX_FREE_COUNTS } from "@/constants";

//now we are going to write a util that increments every time a user uses the api

export const increaseApiLimit = async () => {

    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId,                //one userId is from the prisma table or schema and the other is from the auth() function from clerk just above
        },
    });


    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: {
                userId: userId,
            }, 
            data: {
                count: userApiLimit.count + 1
            },
        })
    }

    else {
        await prismadb.userApiLimit.create({
            data: {
                userId: userId,
                count: 1,
            },
        });
    }
    
}


//now creating another util to check whether the current user has reached the limit of 5 api calls

export const checkUserApiLimit = async() => {

    const {userId} = auth();
    
    if(!userId){
        return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId: userId,
        },  
    });

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS)
    {
        return true;
    }
    else{
        return false;
    }


};

//now we are going to create a util to get the current api limit count so that we can show the loader in the sidebar with the current api used count

export const getApiLimitCount = async() => {

    const {userId} = auth();

    if(!userId){
        return 0;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId: userId,
        },  
    });

    if(!userApiLimit){              //if there is no userApiLimit that means user has not run any api yet so show 0
        return 0;
    }

    return userApiLimit.count;

}

// we will be fetching this getApiLimitCount in the layout.tsx file which is a server component because we can only access prisma from a server component
//then from layout.tsx we will send it as a prop to <Sidebar /> component which is a client component and then we will show the loader in the sidebar with the current api used count
//3:28