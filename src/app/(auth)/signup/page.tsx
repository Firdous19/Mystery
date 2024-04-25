'use client'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/Schemas/signupSchema";
import { ApiResponse } from "@/types/apiResponse";
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
import { Input } from "@/components/ui/input";
import { Loader2, Chrome } from "lucide-react";
import Image from "next/image";



export default function SignInPage() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [ischeckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();

    //Zod Implementation
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    console.log("Response", response.data);
                    setUsernameMessage(response.data.message);


                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    console.log(axiosError)
                    setUsernameMessage(axiosError.response?.data.message ?? "Error Checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }

        checkUserNameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signup', data);
            console.log("Response: ", response.data)
            toast({
                title: "success",
                description: response.data.message
            });

            router.replace(`/verify/${username}`);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast({
                title: 'Signup Failed',
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[500px] p-10 rounded-md shadow-lg space-y-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Join True Feedback</h1>
                <p>Sign up to start your anonymous adventure</p>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your Username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {
                                        ischeckingUsername && <Loader2 className="animate-spin" />
                                    }
                                    <FormMessage >
                                        {
                                            usernameMessage &&
                                            <span
                                                className={`${usernameMessage === 'Username is available' ? "text-green-500" : "text-red-500"}`}
                                            >{usernameMessage}</span>
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            {...field}
                                        />
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
                                    "Submit"
                                )
                            }
                        </Button>
                    </form>
                </Form>
            </div>
            <div>
                <Button className="w-full text-center" variant="outline">
                    <Image className="mr-2" width="28" height="28" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" /> Sign in with Google
                </Button>
            </div>
            <div className="text-center text-[14.2px]">
                <p>
                    Already have an account? <Link className="text-black font-semibold" href="/signin">Login</Link>
                </p>
            </div>
        </div>
    )
}


