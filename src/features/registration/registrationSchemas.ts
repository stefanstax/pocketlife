import { z } from "zod";

export const registrationSchema = z.object({
  id: z.number(),
  username: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
  defaultCurrency: z.string().nonempty(),
});
