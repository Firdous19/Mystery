'use client';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import axios, { AxiosError } from "axios";
import { useEffect, useState, useCallback } from "react";
import { ApiResponse } from "@/types/apiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "@/models/User.models";
import { acceptSchemeMessage } from "@/Schemas/acceptMessageSchema";
import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, Loader2 } from "lucide-react";

export default function Page() {
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { toast } = useToast();

    //Session Hook to get the user details
    const { data: session } = useSession();
    const user = session?.user as User;

    const form = useForm({
        resolver: zodResolver(acceptSchemeMessage)
    });

    const { register, watch, setValue } = form;
    const acceptMessageValue = watch("acceptMessage");

    let baseUrl = "";
    let profileUrl = "";
    if (typeof window !== 'undefined') {
        baseUrl = `${window.location.protocol}//${window.location.host}`;
        profileUrl = `${baseUrl}/me/${user?.username}`;
    }

    const copyToClipBoard = async () => {
        await window.navigator.clipboard.writeText(`http://localhost:3000/feedback/${user?.username}`);

        toast({
            title: "Link Copied",
            description: "Your unique link has been copied to clipboard",
        })
    }

    const handleAcceptMessage = async () => {
        try {
            setIsSwitchLoading(true);
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessage: !acceptMessageValue
            });
            setValue("acceptMessage", !acceptMessageValue);
            toast({
                title: "Success",
                description: acceptMessageValue ? "Message Acceptance Turned Off" : "Message Acceptance Turned On",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to update message status";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }

    const getAcceptMessages = useCallback(async () => {
        try {
            setIsSwitchLoading(true);
            const response = await axios.get<ApiResponse>('/api/accept-message');
            setValue('acceptMessage', response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to fetch message status";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue])

    const getFetchedMessages = useCallback(async (refresh: boolean = false) => {
        try {
            console.log("");
            setIsLoading(true);
            setIsRefreshing(true);
            const response = await axios.get('/api/get-messages');
            setMessages(response.data.message);
            if (refresh) {
                toast({
                    title: "Refreshed",
                    description: "Showing latest messages"
                });
                return;
            }
            toast({
                title: "Success",
                description: "Messages fetched successfully"
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to fetch messages";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [setIsLoading, setMessages]);

    const onMessageDelete = async (messageId: string) => {
        setMessages((messages) => messages.filter(message => message._id !== messageId));
    }

    useEffect(() => {
        getFetchedMessages();
        getAcceptMessages();
    }, []);

    return (
        <div className="max-w-[80%] mx-auto my-20 space-y-7">
            <div className="text-4xl font-semibold">
                <h1>User Dashboard</h1>
            </div>
            <div className="mb-4 space-y-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipBoard}>Copy</Button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessageValue}
                    onCheckedChange={handleAcceptMessage}
                    disabled={isSwitchLoading}
                />
                <span>Accept Message: {acceptMessageValue ? "on" : "off"}</span>
            </div>
            <Separator className="border-5" />
            <div>
                <Button
                    variant={'outline'}
                    onClick={() => getFetchedMessages(true)}
                >
                    {
                        isRefreshing ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            <RefreshCcw className="w-4 h-4" />
                        )
                    }
                </Button>
            </div>
            <section>
                <h2 className="text-lg font-semibold mb-2">Messages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-8">
                    {messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={onMessageDelete}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}