import { z } from 'zod';

export const RegisterCommandSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export type RegisterCommand = z.infer<typeof RegisterCommandSchema>;
