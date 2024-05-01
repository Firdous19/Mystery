import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LogoutBtn() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { toast } = useToast();
    const session = useSession();

    async function handleLogout() {
        try {
            setIsLoggingOut(true);
            await signOut();
            toast({
                title: "Success",
                description: "You have been successfully signed out!",
            })
        } catch (error) {
            console.error("Failed to sign out", error);
            toast({
                title: "Error",
                description: "Failed to sign out",
            })
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <Button
            className="rounded-full px-8"
            variant={'secondary'}
            onClick={handleLogout}
        >
            Logout
        </Button>
    )
}