'use client'
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import LogoutBtn from "./LogoutBtn";

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user as User;
    console.log("User", user);

    const routes = [
        {
            name: "Home",
            path: "/",
            show: true
        },
        {
            name: "SignUp",
            path: "/signup",
            show: !session
        },
        {
            name: "SignIn",
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
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </Link>
                <div>
                    {
                        session && (
                            <span>Welcome, {user.name}</span>
                        )
                    }
                </div>
                <div className="flex justify-between items-center space-x-10">
                    {
                        routes.map(route => {
                            if (route.show) {
                                return (
                                    <Link key={route.name} href={route.path}>
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