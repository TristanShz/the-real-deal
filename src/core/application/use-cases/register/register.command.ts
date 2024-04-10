import { USER_ROLES } from 'src/core/domain/user';
import { z } from 'zod';

export const RegisterCommandSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(USER_ROLES),
});

export type RegisterCommand = z.infer<typeof RegisterCommandSchema>;
