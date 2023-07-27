
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