import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]*$/);

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(2)
    .max(20, { message: "Password must be between 2 and 20 characters" }),
});
