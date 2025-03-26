import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string({ message: "Full Name is required" }).min(1, { message: "Full Name is required" }),
  email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters"  }),
  created_at: z.date(),
  updated_at: z.date(),
});
export type TUser = z.infer<typeof UserSchema>;

export const UserBodySchema = UserSchema.pick({ full_name: true, email: true, password: true, })
export type TUserBody = z.infer<typeof UserBodySchema>;