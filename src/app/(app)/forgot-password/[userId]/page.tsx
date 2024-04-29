'use client';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/Schemas/forgotPasswordSchema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Params {
    params: {
        userId: string
    }
}

export default function Page({ params }: Params) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { userId } = params;

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        console.log(data)
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/forgot-password', { ...data, userId })

            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace('/signin');

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Error",
                description: errorMessage || "An error occurred",
                variant: 'destructive'
            })
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="sm:w-[500px] w-[80%] p-10 rounded-md shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-7">
            <div className="text-center space-y-3">
                <h1 className="text-[40px] font-bold max-sm:leading-[42px]">Forgot Password</h1>
                <p>Enter your email to send a forgor password link</p>
            </div >
            <div>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="confirm your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <span className="flex items-center"><Loader2 className="animate-spin mr-2" /> Please Wait</span>
                                ) : (
                                    "SignIn"
                                )
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}