import { z } from "zod";

export const loginSchemas = z.object({
  email: z.string().email().nonempty({ message: "Email can not be empty." }),
  password: z.string().nonempty({ message: "Password can not be empty." }),
});
