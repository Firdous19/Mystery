import connectDatabase from "@/lib/dbConnect";
import User from "@/models/User.models";
import { NextResponse, NextRequest } from "next/server";
import { Message } from "@/models/User.models"

export async function POST(req: NextRequest) {
    await connectDatabase();

    const { username, content } = await req.json();

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        //is User accepting the messages
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting the messages"
            }, { status: 403 });
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message);

        await user.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error in sending message", error);
        return NextResponse.json({
            success: false,
            message: "Error in sending message"
        }, { status: 500 });
    }
}