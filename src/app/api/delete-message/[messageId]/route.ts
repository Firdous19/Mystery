import { NextRequest, NextResponse } from "next/server";
import connectDatabase from '@/lib/dbConnect'
import { getServerSession, User as NextUser } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/User.models";
import mongoose, { Mongoose, Schema } from "mongoose";

interface Params {
    params: {
        messageId: string
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    const user = session?.user as NextUser
    const messageIdentity = params.messageId;

    console.log("Params", params);

    console.log("messageIdentity", messageIdentity);

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    //making 
    const messageId = new mongoose.Types.ObjectId(messageIdentity);

    try {
        await connectDatabase();

        //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        const message = await User.updateOne(
            { _id: user._id },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        );

        console.log("message", message);

        if (message.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message Deleted Successfully"
        }, { status: 200 })

    } catch (error) {
        console.log("Error Deleting Message", error);
        return NextResponse.json({
            success: false,
            message: "Error Deleting Message"
        }, { status: 500 });
    }
}