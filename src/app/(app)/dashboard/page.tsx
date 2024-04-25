'use client';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Page() {
    const session = useSession();
    // console.log(session)
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {session.data?.user.email}</p>
            <Button onClick={() => signOut()}>Sign Out</Button>
            {/* <Image src={data?.user.image} alt="user image" width={200} height={200} /> */}
        </div>
    )
}