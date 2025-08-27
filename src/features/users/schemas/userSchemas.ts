import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(), // todo Can not update it before reaching 100 transactions
  name: z.string(),
  email: z.string().email(),
  recoveryUrl: z.string(),
  securityName: z.string(),
});

export type UserProfileUpdate = z.infer<typeof userSchema>;
