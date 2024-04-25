'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { verifySchema } from "@/Schemas/verifySchema"
import * as z from "zod"
import { useForm } from "react-hook-form"
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
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function VerifyPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams<{ username: string }>();

    console.log("Params: ", params)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verificationCode: ''
        }
    });


    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post('/api/verify-code', {
                ...data,
                username: params.username
            });
            console.log("Response: ", response.data);
            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace('/signin');

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message;
            const statusCode = axiosError.response?.status;

            toast({
                title: "Verification Error",
                description: errorMessage,
                variant: "destructive",
                action: statusCode === 400 ? (
                    <ToastAction altText="Login" onClick={() => router.replace('/signin')}>Login</ToastAction>
                ) : (
                    <ToastAction altText="Sign In" onClick={() => router.replace('/signup')}>Sign Up</ToastAction>
                )
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="sm:w-[500px] w-[80%] p-10 rounded-md shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-7">
            <div className="text-center space-y-3">
                <h1 className="text-[40px] font-bold max-sm:leading-[42px]">Verify Your Account</h1>
                <p>Enter the Verification code sent to your Email</p>
            </div >
            <div>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="verificationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your verification code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            {
                                isLoading ? (<Loader2 className="animate-spin" />) : ("Submit")
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}