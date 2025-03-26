import { UserBodySchema } from 'src/user/user.schema';
import { z } from 'zod';

export const RegisterSchema = UserBodySchema;
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = UserBodySchema.pick({
  email: true,
  password: true,
});
export type LoginDto = z.infer<typeof LoginSchema>;
