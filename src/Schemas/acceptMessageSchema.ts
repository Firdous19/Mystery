import { z } from 'zod';

export const acceptSchemeMessage = z.object({
    acceptMessages: z.boolean(),
})