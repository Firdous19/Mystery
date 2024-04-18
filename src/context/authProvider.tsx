'use client';
import { SessionProvider } from "next-auth/react"

type AppProps = {
    children: React.ReactNode
}

export default function AuthProvider({ children, }: AppProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}