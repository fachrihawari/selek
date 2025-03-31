import { z } from 'zod';
import { UserBodySchema } from '~/users/users.schema';

export const RegisterSchema = UserBodySchema;
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = UserBodySchema.pick({
  email: true,
  password: true,
});
export type LoginDto = z.infer<typeof LoginSchema>;
