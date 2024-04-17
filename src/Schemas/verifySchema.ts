import { z } from 'zod';

export const verifySchema = z.object({
    verificationCode: z
        .string()
        .length(6, { message: "Verfication code must be 6 digits" })
})