import { resend } from '@/lib/resend'
import ForgotPassword from '@/../emails/ForgotPassword'
import { ApiResponse } from "@/types/apiResponse"

export async function sendForgotPasswordEmail(
    email: string,
    userFirstname: string,
    resetPasswordLink: string
): Promise<ApiResponse> {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Forgot Password',
            react: ForgotPassword({ userFirstname, resetPasswordLink }),
        });

        return { success: true, message: "verification email sent successfully" }
    } catch (emailError) {
        console.error("Error in sending verification email", emailError);
        return { success: false, message: "failed to send verification email" }
    }
}