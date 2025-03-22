import { z } from 'zod';

export const UserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export type TUserSchema = z.infer<typeof UserSchema>;