import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
                console.log("Credentials: ", credentials);
                //credentials.identifier.username to access the creadentials value
                await connectDatabase();
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.username }
                        ]
                    });

                    console.log("User found: ", user)
                    if (!user) {
                        console.log("No user found with this email");
                        throw new Error("No user found with this email");
                    }

                    if (!user.isVerified) {
                        console.log("Please verify your account first before login");
                        throw new Error("Please verify your account first before login");
                    }

                    //credentials.password?? todo---
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password as string);

                    if (!isPasswordCorrect) {
                        console.log("Invalid Credentials");
                        throw new Error("Invalid Credentials");
                    };

                    console.log("User: ", user)

                    return user;

                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },

        )
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
        },
        async signIn({ account, profile }) {
            console.log("Account: ", account);
            console.log("Profile: ", profile);

            if (account?.provider === "google") {
                await connectDatabase(); // Ensure this function is working correctly

                try {
                    let user = await User.findOne({ email: profile?.email });
                    console.log("User Found: ", user);

                    if (!user) {
                        user = new User({
                            username: profile?.name,
                            email: profile?.email,
                            isVerified: true,
                            isAcceptingMessages: true,
                            password: undefined,
                            verifyCode: undefined,
                            verifyCodeExpiry: undefined,
                            messages: []
                        });

                        await user.save({ validateBeforeSave: false });
                        console.log("New User Created: ", user);
                    }

                    return true; // Return true after handling the Google sign-in
                } catch (error) {
                    console.error("Error in Google Sign In", error);
                    return false; // Return false if there's an error
                }
            }

            if (account?.provider === "credentials") {
                return true; // Return true for other authentication providers
            }

            return false; // Return false if no provider matches
        }

    }
}