'use client';
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { ToastAction } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/Schemas/signinSchema";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        console.log(data);
        try {
            setIsSubmitting(true);
            setError('');
            const response = await signIn('credentials', {
                ...data,
                redirect: false,
            });
            console.log("Response: ", response);
            if (response?.error) {
                setError(response?.error);
                toast({
                    title: "Error",
                    description: response?.error,
                    variant: 'destructive'
                });
                return;
            }
            toast({
                title: "Success",
                description: "Signed in successfully",
            });

            router.replace('/dashboard');

        } catch (err) {
            console.log("error", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[500px] p-10 rounded-md shadow-lg space-y-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Welcome back to True Feedback</h1>
                <p>Sign in to continue your secret conversations</p>
            </div>
            <div>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            name="email"
                            control={form.control}
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                        />
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
            <div className="text-center text-[14.2px]">
                <p>
                    Don't have an account? <Link href="/signup" className="text-black font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    )

}