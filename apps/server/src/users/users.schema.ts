import { z } from 'zod';

// Base user schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z
    .string({ message: 'Full Name is required' })
    .min(1, { message: 'Full Name is required' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TUser = z.infer<typeof UserSchema>;
export type TUserQueryResult = Pick<
  TUser,
  'id' | 'fullName' | 'email' | 'password'
>;
export type TUserSafe = Omit<TUserQueryResult, 'password'>;

// User body schema for creating and updating a user
export const UserBodySchema = UserSchema.pick({
  fullName: true,
  email: true,
  password: true,
});
export type TUserBody = z.infer<typeof UserBodySchema>;
