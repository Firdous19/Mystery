"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/Schemas/messageSchema";
import * as z from 'zod'
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCompletion } from 'ai/react';
import Link from "next/link";

interface Params {
    params: {
        username: string
    }
}

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function MeUsernamePage({ params }: Params) {
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const { toast } = useToast()
    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({
        api: '/api/suggest-messages',
        initialCompletion: initialMessageString,
    });
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    });
    const { setValue, watch } = form;

    const contentWatch = watch('content');

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setIsSendingMessage(true);
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username: params.username
            });
            console.log(response.data);

            toast({
                title: "Success",
                description: response.data.message
            });

            setValue('content', '')

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message;

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsSendingMessage(false);
        }
    }

    const fetchSuggestedMessages = async () => {
        try {
            console.log('fetching messages');
            await complete('');
        } catch (error) {
            console.error('Error fetching messages:', error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const handleOnClick = (message: string) => {
        setValue('content', message);
    }

    useEffect(() => {
        if (contentWatch.length < 10) {
            setDisabled(true);
            return;
        }
        setDisabled(false);
    }, [contentWatch]);

    return (
        <section className="mt-14 md:max-w-[60%] max-w-[85%] mx-auto space-y-7 mb-56">
            <section className="space-y-8">
                <div className="text-center text-4xl font-bold">
                    <h1>Public Profile Link</h1>
                </div>
                <div>
                    <Form {...form}>
                        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Send an anonymous message to @{params.username}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none"
                                                placeholder="write an anonymous message here" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full grid place-items-center">
                                {
                                    isSendingMessage ? (
                                        <Button disabled>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </Button>
                                    ) : (
                                        <Button disabled={disabled} type="submit">Send It</Button>
                                    )
                                }
                            </div>
                        </form>
                    </Form>
                </div>
            </section>
            <section className="space-y-7">
                <div className="space-y-5">
                    <Button onClick={fetchSuggestedMessages}>Suggest Messages</Button>
                    <p>Click any message below to select it</p>
                </div>
                <div className="p-10 border rounded-lg space-y-5">
                    <h1>Messages</h1>
                    <div className="space-y-5">
                        {
                            error ? (
                                <p className="text-red-500">{error.message}</p>
                            ) : (
                                parseStringMessages(completion).map((message, index) => (
                                    <div key={index}>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleOnClick(message)}
                                        >
                                            {message}
                                        </Button>
                                    </div>
                                )))
                        }
                    </div>
                </div>
            </section>
            <Separator />
            <section className="text-center space-y-5">
                <h1>Get your message board</h1>
                <div>
                    <Link href={'/signup'}>
                        <Button>Create account</Button>
                    </Link>
                </div>
            </section>
        </section >
    )
}