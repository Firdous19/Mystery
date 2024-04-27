'use client';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/apiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "@/models/User.models";
import { acceptSchemeMessage } from "@/Schemas/acceptMessageSchema";
import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, Loader2 } from "lucide-react";

export default function Page() {
    // const [acceptMessage, setAcceptMessage] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { data: session } = useSession();
    const user = session?.user as User;
    console.log("session", session);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(acceptSchemeMessage)
    });

    const { register, watch, setValue } = form;
    const acceptMessageValue = watch("acceptMessage");

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
            const response = await axios.post('/api/accept-message', {
                acceptMessage: !acceptMessageValue
            });
            setValue("acceptMessage", !acceptMessageValue);

            console.log("Response: ", response.data);

            toast({
                title: "Success",
                description: acceptMessageValue ? "Message Acceptance Turned Off" : "Message Acceptance Turned On",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to update message status";

            console.log("Error: ", errorMessage);

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }

    const getFetchedMessages = async () => {
        try {
            setIsLoading(true);
            setIsRefreshing(true);
            const response = await axios.get('/api/get-messages');
            console.log("Response: ", response.data);
            setMessages(response.data.message);
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
    }

    const onMessageDelete = async (messageId: string) => {
        setMessages((prev) => prev.filter(message => message._id !== messageId))
    }

    useEffect(() => {
        getFetchedMessages();
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
                        value={`http://localhost:3000/feedback/${user?.username}`}
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
                    disabled={isLoading}
                />
                <span>Accept Message: {acceptMessageValue ? "on" : "off"}</span>
            </div>
            <Separator className="border-5" />
            <div>
                <Button
                    variant={'outline'}
                    onClick={getFetchedMessages}
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
                        <MessageCard key={message._id} message={message} onMessageDelete={onMessageDelete} />
                    ))}
                </div>
            </section>
        </div>
    )
}