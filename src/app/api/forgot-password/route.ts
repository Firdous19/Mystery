import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User.models";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { userId, newPassword } = await req.json();

        const password = await bcrypt.hash(newPassword, 10);

        const user = await User.findByIdAndUpdate(userId, {
            password
        }, { new: true });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}