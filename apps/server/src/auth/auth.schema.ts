import { UserSchema } from "src/user/user.schema";
import { z } from "zod";

export const RegisterSchema = UserSchema.extend({})
export type RegisterDto = z.infer<typeof RegisterSchema>;