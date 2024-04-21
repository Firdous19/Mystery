import connectDatabase from "@/lib/dbConnect";
import { getServerSession, User as NextUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.models";

export async function POST(req: NextRequest) {
    await connectDatabase();
    const session = await getServerSession(authOptions);
    const user: NextUser = session?.user as NextUser;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const UserId = user._id;
    const { acceptMessage } = await req.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(UserId, {
            isAcceptingMessage: acceptMessage
        }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "Failed to accept user status to accept messages"
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Message acceptance status updated Successfully",
            user: updatedUser
        }, { status: 500 });

    } catch (error) {
        console.log("Failed to accept user status to accept messages");
        return NextResponse.json({
            success: false,
            message: "Failed to accept user status to accept messages"
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const user: NextUser = session?.user as NextUser;

    if (!session || !session.user) {
        console.log();
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const userId = user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            message: "User found successfully",
            acceptMessages: user.isAcceptingMessage
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to get user status to accept messages"
        }, { status: 500 });
    }
}