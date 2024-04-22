import { NextResponse, NextRequest } from "next/server";
import connectDatabase from "@/lib/dbConnect";
import User from "@/models/User.models";
import bcrypt from "bcryptjs";
import { sendverificationEmail } from "@/helpers/sendEmail";

async function generateHashedPasswordAndVerificationExpiryDate(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    return { hashedPassword, expiryDate }
}

export async function POST(req: NextRequest) {
    await connectDatabase();
    try {
        const { username, email, password } = await req.json();

        const existingUserByUserName = await User.findOne({
            username,
            isVerified: true
        });

        if (existingUserByUserName) {
            return NextResponse.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 });
        }

        const existingUserByEmail = await User.findOne({ email });

        //Verification Code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User is already registered"
                }, { status: 400 })
            }

            const { hashedPassword, expiryDate } = await generateHashedPasswordAndVerificationExpiryDate(password)

            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verificationCode;
            existingUserByEmail.verifyCodeExpiry = expiryDate;

            await existingUserByEmail.save();

        }
        else {
            const { hashedPassword, expiryDate } = await generateHashedPasswordAndVerificationExpiryDate(password);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
        }

        //Verification Email
        const emailResponse = await sendverificationEmail(email, username, verificationCode);

        if (!emailResponse.success) {
            return NextResponse.json({ ...emailResponse }, { status: 500 });
        }

        return NextResponse.json({ ...emailResponse, message: "User registered Successfully please verify your account" }, { status: 200 });

    } catch (error: any) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        },
            { status: 500 }
        )

    }
}