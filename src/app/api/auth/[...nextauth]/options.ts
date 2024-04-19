import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import connectDatabase from "@/lib/dbConnect";
import User from "@/models/User.models";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                console.log(credentials);
                //credentials.identifier.username to access the creadentials value
                await connectDatabase();
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account first before login");
                    }

                    //credentials.password?? todo---
                    const isPasswordCorrect = await bcrypt.compare(credentials.identifier.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid Credentials");
                    }

                    return user;

                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user, }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        }
    }
}