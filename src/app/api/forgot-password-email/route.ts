import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.models";
import connectDatabase from "@/lib/dbConnect";
import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";


export async function POST(req: NextRequest) {
    await connectDatabase();
    try {
        const { email } = await req.json();

        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
            return NextResponse.json({
                success: false,
                message: "Email not found please sign up first"
            }, { status: 404 });
        }

        //send an email;
        const emailResponse = await sendForgotPasswordEmail(email, isUserExists.username, `http://localhost:3000/forgot-password/${isUserExists._id}`);

        if (!emailResponse.success) {
            return NextResponse.json({ ...emailResponse }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            userId: isUserExists._id,
            message: "Email sent successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}