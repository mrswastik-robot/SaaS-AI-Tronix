//since we are using useForm and taking input from user, we need to mark this component as use client
"use client";

import axios from "axios";

import { toast } from "react-hot-toast";

import * as z from "zod";
import { formSchema} from './constants';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChatCompletionRequestMessage } from "openai";

import ReactMarkdown from "react-markdown";           // we are not getting the code snippet in the markdown format, so we need to import this


import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {cn} from "@/lib/utils";

import {Heading }from "@/components/heading";
import {Empty} from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { useProModal } from "@/hooks/use-pro-model";


import {Code } from "lucide-react";

const CodePage = () => {

    const router = useRouter();

    const openProModal = useProModal();

    const [messages , setMessages] = useState<ChatCompletionRequestMessage[]>([]); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;          //this is to disable the button and input when the form is submitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt,
            };

            const newMessages = [...messages , userMessage];

            const response = await axios.post("/api/code", {
                messages: newMessages,
            });

            setMessages((current) => [...current , userMessage, response.data])          //1:53

            form.reset();
            
        } catch (error:any) {
            //todo : open pro model     //1:54
            if(error?.response?.status === 403) {
                openProModal.onOpen();
            }else{
                toast.error("API is being used heavily right now. Please try again later.");
            }
            // console.log(error);
        } finally {
            router.refresh();     //all of our server components are gonna update
        }
    };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate Code with your text prompts."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                                placeholder="Write rat in the maze algorithm in python."
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

            {messages.length === 0 && !isLoading && (
                <Empty label="No Code Prompted."/>
                )}

            <div className=" flex flex-col-reverse gap-y-4">
                {messages.map((message) => (
                    <div key={message.content}
                    className={cn("p-8 w-full flex gap-x-8 rounded-lg", message.role === 'user' ? "bg-white border border-black/10" : "bg-muted")}
                    >
                        {message.role === 'user' ? <UserAvatar/> : <BotAvatar/>}

                        <ReactMarkdown
                        components={{
                            pre:({node , ...props}) => (<div className=" overflow-auto w-full my-2 bg-black text-green-600 p-2 rounded-lg"><pre {...props}/></div>),
                            code: ({node , ...props}) => (<code className="bg-black/10 rounded-lg p-1 " {...props}/>)
                        }}
                        className="text-sm overflow-hidden leading-7">
                            {message.content || ""}

                        </ReactMarkdown>
                    </div>
                ))}
            </div>
        </div>

        
      </div>

    </div>
  );
};

export default CodePage;
