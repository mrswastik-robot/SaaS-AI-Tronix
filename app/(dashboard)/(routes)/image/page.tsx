//since we are using useForm and taking input from user, we need to mark this component as use client
"use client";

import axios from "axios";

import { toast } from "react-hot-toast";

import * as z from "zod";
import { amountOptions, resolutionOptions, formSchema} from "./constants"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

// import { ChatCompletionRequestMessage } from "openai";


import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {cn} from "@/lib/utils";
import { Card, CardFooter } from "@/components/ui/card";

import { Download, ImageIcon } from "lucide-react";


import {Heading }from "@/components/heading";
import {Empty} from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { useProModal } from "@/hooks/use-pro-model";



const ImagePage = () => {

    const router = useRouter();

    const openProModal = useProModal();

    const [images , setImages] = useState<string[]>([]); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1", 
            resolution: "512x512",
        },
    });

    const isLoading = form.formState.isSubmitting;          //this is to disable the button and input when the form is submitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            setImages([]);      //this is to clear the images array when we submit the form again

            const response = await axios.post("/api/image", values);

            const urls = response.data.map((image: {url: string}) => image.url);     //here we are creating an arrray going through reponse.data and we are just going to return the url which is a string
            //so we extract the url from each individual image in the array that we are going to get from the axios and then we set the array of urls to the state just below
            //2:27 or understand using co-pilot

            setImages(urls);

            // console.log(values);
            
            form.reset();
            
        } catch (error:any) {
            //todo : open pro model     //1:54
            if(error?.response?.status === 403) {
                openProModal.onOpen();
            }else{
                toast.error("API is being used heavily right now. Please try again later.");
            }
            console.log(error);
        } finally {
            router.refresh();     //all of our server components are gonna update
        }
    };

  return (
    <div>
      <Heading
        title="Text to Image Generation"
        description="DALL-E powered Image Generation model."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                        <FormItem className=" col-span-12 lg:col-span-6">
                            <FormControl className=" m-0 p-0">
                                <Input
                                className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                disabled={isLoading}
                                placeholder="Gandhi Jii riding a horse..."
                                autoComplete="off"
                                {...field}    // this {...field} is the substitute for manually writing the onChange, onBlur, value, name, ref, etc.    //1:39:00
                                />
                            </FormControl>

                        </FormItem>
                    )}
                    />

                    {/* //giving the dropdown for amout of images to be generated */}

                    <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => ( 
                        <FormItem className=" col-span-12 lg:col-span-2">
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {amountOptions.map((option) => (
                                            <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>

                            </Select>
                        </FormItem>

                    )}
                    />

                    {/* //giving the dropdown for resolution of images to be generated */}

                    <FormField
                    control={form.control}
                    name="resolution"
                    render={({field}) => ( 
                        <FormItem className=" col-span-12 lg:col-span-2">
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {resolutionOptions.map((option) => (
                                            <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>

                            </Select>
                        </FormItem>

                    )}
                    />

                    <Button className=" col-span-12 lg:col-span-2 w-full mt-2 md:mt-0" disabled={isLoading}>
                        Generate...
                    </Button>

                </form>

            </Form>
        </div>


        <div className=" space-y-4 mt-4">

            {isLoading && (
                <div className=" p-20">
                    <Loader/>
                </div>
                )}

            {images.length === 0 && !isLoading && (
                <Empty label="No Image Generated."/>
                )}

                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    {images.map((src) => (
                        <Card 
                        key={src}
                        className=" rounded-lg overflow-hidden"
                        >
                            <div className=" relative aspect-square">
                                <Image 
                                alt="Image"
                                fill
                                src={src}
                                />
                            </div>

                            <CardFooter className=" p-2">
                                <Button
                                onClick={() => window.open(src, "_blank")}
                                variant="secondary"
                                className=" w-full "
                                >
                                    <Download className=" h-4 w-4 mr-2"/>
                                    Download
                                </Button>
                            </CardFooter>

                        </Card>

                    )) }
                </div>

            
        </div>

        
      </div>

    </div>
  );
};

export default ImagePage;
