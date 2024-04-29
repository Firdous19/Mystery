import { z } from 'zod';

export const forgotPasswordEmail = z.object({
    email: z.string().email({ message: "Please enter a valid email address" })
})

export const forgotPasswordSchema = z.object({
    newPassword:
        z.string()
            .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword:
        z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
})
    .refine(data => data.newPassword === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"]
        })