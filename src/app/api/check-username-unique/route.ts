import connectDatabase from "@/lib/dbConnect";
import User from "@/models/User.models";
import { z } from "zod";
import { usernameValidation } from '@/Schemas/signupSchema'
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: NextRequest) {
    await connectDatabase();
    //http:localhost:3000/api/check-username-uniqueness?username=firdous
    try {
        const { searchParams } = new URL(req.url)
        console.log(searchParams);
        const queryParam = {
            username: searchParams.get('username')
        }

        console.log(queryParam)

        //Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        console.log("REsult", result);

        if (!result.success) {
            console.log(result.error!)
            const usernameErrors = result.error.format().username?._errors || [];

            return NextResponse.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(' .') : "Invalid Query Parameter"
            }, { status: 400 });
        }

        const { username } = result.data

        /*If the user is not verified and the requested username is same as the user in the database then also the username will be available*/
        const user = await User.findOne({ username, isVerified: true });

        if (user) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Username is available"
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username uniqueness", error);
        return NextResponse.json({
            success: false,
            message: "Error in checking username"
        }, { status: 500 });
    }
}