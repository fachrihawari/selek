import { UserBodySchema } from "src/user/user.schema";
import { z } from "zod";

export const RegisterSchema = UserBodySchema
export type RegisterDto = z.infer<typeof RegisterSchema>;