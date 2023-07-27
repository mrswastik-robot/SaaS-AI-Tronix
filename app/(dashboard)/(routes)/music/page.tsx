//since we are using useForm and taking input from user, we need to mark this component as use client
"use client";

import axios from "axios";

import * as z from "zod";
import { formSchema} from "./constants"
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useState } from "react";


import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {cn} from "@/lib/utils";

import {Heading }from "@/components/heading";
import {Empty} from "@/components/empty";
import { Loader } from "@/components/loader";


import { useProModal } from "@/hooks/use-pro-model";


// import { MessageSquare } from "lucide-react";
import { Music } from "lucide-react";

const MusicPage = () => {

    const router = useRouter();

    const openProModal = useProModal();

    const [music , setMusic] = useState<string>(); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;          //this is to disable the button and input when the form is submitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            setMusic(undefined);      //this is to clear the music when we submit the form again



            const response = await axios.post("/api/music", values);

            setMusic(response.data.audio);

            form.reset();
            
        } catch (error:any) {
            //todo : open pro model     //1:54
            if(error?.response?.status === 403) {
                openProModal.onOpen();
            }
            // console.log(error);
        } finally {
            router.refresh();     //all of our server components are gonna update
        }
    };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="AI generated Non-copyright music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />

      <div className=" px-4 lg:px-8">
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className=" rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                >
                    <FormField
                    name="prompt"
                    render={({field}) => (
                        <FormItem className=" col-span-12 lg:col-span-10">
                            <FormControl className=" m-0 p-0">
                                <Input
                                className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                disabled={isLoading}
                                placeholder="Beethoven ft. The Strokes"
                                autoComplete="off"
                                {...field}    // this {...field} is the substitute for manually writing the onChange, onBlur, value, name, ref, etc.    //watch on 1:39:00
                                />
                            </FormControl>

                        </FormItem>
                    )}/>
                    <Button className=" col-span-12 lg:col-span-2 w-full mt-2 md:mt-0" disabled={isLoading}>
                        Generate...
                    </Button>

                </form>

            </Form>
        </div>


        <div className=" space-y-4 mt-4">

            {isLoading && (
                <div className=" p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                    <Loader/>
                </div>
                )}

            {!music  && !isLoading && (
                <Empty label="No Music Generated."/>
                )}

                {music && (
                    <audio controls className=" w-full mt-8">
                        <source src={music} type="audio/mpeg"/>
                    </audio>
                )}
        </div>

        
      </div>

    </div>
  );
};

export default MusicPage;
