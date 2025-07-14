import { z } from "zod";

export const userSchemas = z.object({
  id: z.string(),
  username: z.string(), // Can not update it before reaching 100 transactions
  name: z.string(),
  email: z.string().email(),
  recoveryUrl: z.string(),
  securityName: z.string(),
});
