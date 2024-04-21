import connectDatabase from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User as NextUser } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.models";
import mongoose from "mongoose";

export async function GET() {
    await connectDatabase();

    const session = await getServerSession(authOptions);
    const user: NextUser = session?.user as NextUser;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "user not authenticated"
        }, { status: 400 });
    }

    const UserId = user._id;

    try {
        const userMessages = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(UserId)
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ]);

        if (!userMessages || userMessages.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            message: userMessages[0].messages
        }, { status: 200 });

    } catch (error) {
        console.log("Error in getting the messages")
        return NextResponse.json({
            success: false,
            message: "Error in getting the messages"
        }, { status: 500 });
    }
}