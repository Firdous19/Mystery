import { z } from 'zod';

export const signinSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must atleast 6 characters" })
})