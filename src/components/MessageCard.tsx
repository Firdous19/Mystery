'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios, { AxiosError } from "axios"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { ApiResponse } from "@/types/apiResponse"
import { useToast } from "./ui/use-toast"
import { useState } from "react"
import { MessageCardProps } from "@/types/MessageCardProps"
import dayjs from "dayjs"



export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const messageId = message._id;

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/delete-message/${messageId}`);
            console.log("Response", response.data);
            toast({
                title: "Success",
                description: response.data.message
            });

            onMessageDelete(message._id)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? "Error Deleting Message";
            console.error(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card >
            <CardHeader className="space-y-5">
                <div className="flex justify-between items-center">
                    <CardTitle>{message?.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={'destructive'}><X className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div >
                    <CardDescription>
                        {dayjs(message?.createdAt).format("DD MMMM, YYYY hh:mm A")}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>

    )
}