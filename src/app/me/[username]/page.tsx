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
import { useState } from "react";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Params {
    params: {
        username: string
    }
}

export default function MeUsernamePage({ params }: Params) {
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const { toast } = useToast()
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    });
    const { setValue } = form

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

    return (
        <div className="mt-14 md:max-w-[60%] max-w-[85%] mx-auto space-y-14">
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
                                    <Button type="submit">Submit</Button>
                                )
                            }
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}