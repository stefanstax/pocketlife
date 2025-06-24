import { z } from "zod";

export const registrationSchema = z.object({
  id: z.string(),
  username: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email().nonempty({ message: "Email is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
});
