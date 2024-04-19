import connectDatabase from "@/lib/dbConnect";
import User from "@/models/User.models";
import { NextRequest, NextResponse } from "next/server";
import { verifySchema } from "@/Schemas/verifySchema"
import { z } from "zod";


export async function POST(req: NextRequest) {
    await connectDatabase();

    try {
        const { username, verificationCode } = await req.json()

        const decodedUsername = decodeURIComponent(username);

        console.log(verificationCode);

        const result = verifySchema.safeParse({
            verificationCode
        })

        console.log(result)

        if (!result.success) {
            const verificationcodeErrors = result.error.format().verificationCode?._errors;
            return NextResponse.json({
                success: false,
                message: verificationcodeErrors
            }, { status: 400 });
        }

        const user = await User.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === verificationCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry as Date) > new Date();

        if (!isCodeValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid Verification Code"
            }, { status: 400 });
        }

        if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verification Code has expired please sign up again to get a new code"
            }, { status: 400 });
        }

        user.isVerified = true;
        user.verifyCode = undefined;
        user.verifyCodeExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            message: "Account verification succesfully"
        }, { status: 200 });


    } catch (error) {
        console.log("Error in validating verification code", error);
        return NextResponse.json({
            success: false,
            message: "Error in validating verification code"
        }, { status: 500 });
    }
}