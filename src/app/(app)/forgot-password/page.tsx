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
import { forgotPasswordEmail, forgotPasswordSchema } from "@/Schemas/forgotPasswordSchema";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


export default function Page() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof forgotPasswordEmail>>({
        resolver: zodResolver(forgotPasswordEmail)
    })

    const handleSubmit = async (data: z.infer<typeof forgotPasswordEmail>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/forgot-password-email', { ...data })

            toast({
                title: "Success",
                description: response.data.message,
            });

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Error",
                description: errorMessage || "An error occurred",
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="sm:w-[500px] w-[80%] p-10 rounded-md shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-6">
            <div className="text-center space-y-3">
                <h1 className="text-[40px] font-bold max-sm:leading-[42px]">Forgot Password</h1>
                <p>Enter your email and we'll send a link to reset your password</p>
            </div >
            <div>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
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
            <div className="text-center">
                <Button variant={'link'} >
                    <Link className="flex items-center" href={'/signin'} ><ChevronLeft className="mr-2" />Back to Login</Link>
                </Button>
            </div>
        </div>
    )
}