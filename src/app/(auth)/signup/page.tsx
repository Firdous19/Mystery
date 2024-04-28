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
import { signIn } from "next-auth/react";



export default function SignInPage() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [ischeckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

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
        console.log("Data: ", data);
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

    const signInwithGoogle = async () => {
        try {
            setIsGoogleSubmitting(true);
            const response = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false
            });

            toast({
                title: 'Success',
                description: 'Successfully signed in with Google',
            })

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            })
        }
        finally {
            setIsGoogleSubmitting(false);
        }

    }


    return (
        <div className="grid grid-cols-12 md:bg-[#b7eaec]">
            <div className="h-screen col-span-5 custom:hidden">
                <div className="mx-5 my-4 mb-6">
                    <Link href={'/'} >
                        <svg width="160.16001586914064" height="47.98919860202538" viewBox="0 0 369.66666666666663 85.3360069148729" className="looka-1j8o68f"><defs id="SvgjsDefs1755"></defs><g id="SvgjsG1756" transform="matrix(1.1125945478724804,0,0,1.1125945478724804,-11.682242752661043,-10.124610810060709)" fill="#191919"><path xmlns="http://www.w3.org/2000/svg" d="M15.3,66.1h65.5V32.4H15.3V66.1z M50.6,49.2l27.8-13.8V63L50.6,49.2z M74.6,63.7H21.4L48,50.5L74.6,63.7z M48,47.9  L21.4,34.7h53.2L48,47.9z M45.4,49.2L17.6,63V35.4L45.4,49.2z"></path><rect xmlns="http://www.w3.org/2000/svg" x="16.4" y="70.8" width="63.2" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="16.4" y="77.1" width="63.2" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="16.4" y="83.5" width="40.8" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="16.4" y="9.1" width="63.2" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="10.5" y="21.1" width="11.4" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="31.7" y="21.1" width="11.4" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="52.9" y="21.1" width="11.4" height="2.3"></rect><rect xmlns="http://www.w3.org/2000/svg" x="74" y="21.1" width="11.4" height="2.3"></rect></g><g id="SvgjsG1757" transform="matrix(0.8190999930102283,0,0,0.8190999930102283,102.00831560971602,20.857011051806893)" fill="#000000"><path d="M18.242 12.754000000000001 l0 2.5 l-7.168 0 l0 24.746 l-2.6953 0 l0 -24.746 l-7.168 0 l0 -2.5 l17.031 0 z M42.474546875 40 l-6.9727 -12.402 l-5.1953 0 l0 12.402 l-2.7148 0 l0 -27.246 l8.75 0 c5.3906 0 8.0078 3.3789 8.0078 7.5391 c0 3.75 -2.207 6.6016 -6.1523 7.1875 l7.4023 12.52 l-3.125 0 z M30.306646875 15.195 l0 10.117 l5.7227 0 c3.8867 0 5.7031 -2.0508 5.7031 -5.0195 c0 -2.9297 -1.8164 -5.0977 -5.7031 -5.0977 l-5.7227 0 z M64.77315625 40.37109 c-5.4688 0 -9.6484 -3.5156 -9.6484 -9.2188 l0 -18.398 l2.7148 0 l0 18.008 c0 4.6875 3.0078 7.0898 6.9336 7.0898 c3.9063 0 6.9922 -2.4219 6.9922 -7.0898 l0 -18.008 l2.6953 0 l0 18.398 c0 5.7031 -4.1992 9.2188 -9.6875 9.2188 z M100.802734375 15.254000000000001 l-11.406 0 l0 9.9023 l10.02 0 l0 2.4805 l-10.02 0 l0 9.8633 l11.406 0 l0 2.5 l-14.219 0 l0 -27.246 l14.219 0 l0 2.5 z M125.5824375 15.254000000000001 l-11.465 0 l0 9.8633 l10.02 0 l0 2.5195 l-10.02 0 l0 12.363 l-2.8125 0 l0 -27.246 l14.277 0 l0 2.5 z M149.580078125 15.254000000000001 l-11.406 0 l0 9.9023 l10.02 0 l0 2.4805 l-10.02 0 l0 9.8633 l11.406 0 l0 2.5 l-14.219 0 l0 -27.246 l14.219 0 l0 2.5 z M174.30078125 15.254000000000001 l-11.406 0 l0 9.9023 l10.02 0 l0 2.4805 l-10.02 0 l0 9.8633 l11.406 0 l0 2.5 l-14.219 0 l0 -27.246 l14.219 0 l0 2.5 z M184.802784375 40 l0 -27.246 l8.418 0 c8.2031 0 12.441 5.7031 12.441 13.613 c0 7.9297 -4.2383 13.633 -12.441 13.633 l-8.418 0 z M187.517584375 37.5 l5.6445 0 c6.543 0 9.707 -4.4922 9.707 -11.133 c0 -6.6211 -3.1641 -11.113 -9.707 -11.113 l-5.6445 0 l0 22.246 z M228.937375 25.84 c3.2422 0.82031 5.4102 3.1641 5.4102 6.8555 c0 4.2383 -3.0859 7.3047 -7.4414 7.3047 l-10.391 0 l0 -27.246 l8.0664 0 c4.5313 0 7.7539 2.9883 7.7539 7.1094 c0 2.6953 -1.25 4.9023 -3.3984 5.9766 z M229.757375 20.039 c0 -2.7148 -2.0117 -4.8438 -5.2148 -4.8438 l-5.3906 0 l0 9.7852 l6.1719 0 c2.5195 0 4.4336 -2.2461 4.4336 -4.9414 z M226.496375 37.5195 c3.125 0 5.2148 -2.3242 5.2148 -5.0781 c0 -2.9492 -2.207 -5.1172 -5.5273 -5.1172 l-7.0313 0 l0 10.195 l7.3438 0 z M262.134890625 40 l-2.4609 -6.8359 l-12.637 0 l-2.4609 6.8359 l-2.8711 0 l10.039 -27.246 l3.2031 0 l10.039 27.246 l-2.8516 0 z M247.935590625 30.6836 l10.84 0 l-5.4297 -15.078 z M286.0159375 40.37109 c-7.5391 0 -13.438 -5.2344 -13.438 -14.004 c0 -8.75 5.8984 -13.984 13.438 -13.984 c5.1758 0 9.5703 2.5 11.758 6.875 l-2.4609 1.0938 c-1.8164 -3.4375 -5.2734 -5.3125 -9.2969 -5.3125 c-5.957 0 -10.742 4.0625 -10.742 11.328 c0 7.2852 4.7852 11.348 10.742 11.348 c4.0234 0 7.4805 -1.875 9.2969 -5.3125 l2.4609 1.0938 c-2.1875 4.375 -6.582 6.875 -11.758 6.875 z M323.294859375 40 l-10.273 -12.969 l-2.5195 0 l0 12.969 l-2.7148 0 l0 -27.246 l2.7148 0 l0 11.797 l2.5195 0 l9.7656 -11.797 l3.3398 0 l-10.762 12.969 l11.406 14.277 l-3.4766 0 z"></path></g></svg>
                    </Link>
                </div>
                <div className="space-y-16 p-5">
                    <h1 className="text-3xl font-semibold px-10">Connect Share and <br />spark conversations <br /> anonymously!</h1>
                    <Image className="mx-auto animate-pulse" src={'/images/loginImage.png'} width={500} height={500} alt="login" />
                </div>
            </div>
            <div className="col-span-7 md:relative bg-white rounded-l-3xl
            custom:absolute custom:top-1/2 custom:left-1/2 custom:-translate-x-1/2 custom:-translate-y-1/2">
                <div className="w-[500px] p-10 rounded-md shadow-2xl space-y-5 mx-auto mt-12">
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
                        <Button onClick={signInwithGoogle} type="submit" className="w-full text-center" variant="outline">

                            {
                                isGoogleSubmitting ? (
                                    <span className="flex items-center"><Loader2 className="animate-spin mr-2" /> Please Wait</span>
                                ) : (
                                    <span className="flex items-center">
                                        <Image className="mr-2" width="28" height="28" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" /> Sign in with Google
                                    </span>
                                )
                            }
                        </Button>
                    </div>
                    <div className="text-center text-[14.2px]">
                        <p>
                            Already have an account? <Link className="text-black font-semibold" href="/signin">Login</Link>
                        </p>
                    </div>
                </div >
            </div>
        </div>
    )
}


