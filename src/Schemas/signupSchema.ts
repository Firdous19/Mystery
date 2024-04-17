import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast of 2 characters")
    .max(20, "Username must be of atleat 16 character")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must atleast 6 characters" })
});