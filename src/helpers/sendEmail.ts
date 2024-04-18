import { resend } from '@/lib/resend'
import VerificationEmail from '@/../emails/Verification.email'
import { ApiResponse } from "@/types/apiResponse"

export async function sendverificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: "verification email sent successfully" }
    } catch (emailError) {
        console.error("Error in sending verification email", emailError);
        return { success: false, message: "failed to send verification email" }
    }
}