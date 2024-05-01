'use client'
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import LogoutBtn from "./LogoutBtn";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user as User;
    console.log("User", user);

    console.log("Session", session);

    const routes = [
        {
            name: "Home",
            path: "/",
            show: !session
        },
        {
            name: "Signup",
            path: "/signup",
            show: !session
        },
        {
            name: "Login",
            path: "/signin",
            show: !session
        },
        {
            name: "Dashboard",
            path: "/dashboard",
            show: session
        },
    ]


    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-950 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </Link>
                <div>
                    {
                        session && (
                            <span>Welcome, {user.username || user.name}</span>
                        )
                    }
                </div>
                <div className="flex justify-between items-center space-x-10">
                    {
                        routes.map(route => {
                            if (route.show) {
                                return (
                                    <Link
                                        className={`hover:text-gray-300 ${usePathname() === route.path ? 'border-b-2 border-white' : ''} px-2 py-1` }
                                        key={route.name} href={route.path}>
                                        <span>{route.name}</span>
                                    </Link>
                                )
                            }
                        })
                    }
                    {
                        session && <LogoutBtn />
                    }
                </div>
            </div>
        </nav>
    )
}