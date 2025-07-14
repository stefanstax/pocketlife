import { z } from "zod";

export const registrationSchema = z.object({
  username: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email().nonempty({ message: "Email is required" }),
  name: z.string().min(1, { message: "Name is required." }),
  passcode: z.string().regex(/^\d{6}$/, {
    message: "Passcode must be a 6-digit number",
  }),
  recoveryUrl: z
    .string()
    .min(1, {
      message: "Recovery URL must be something that only you would know.",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Only characters and numbers allowed.",
    }),
  securityName: z
    .string()
    .min(1, { message: "Secret word only you know." })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Only letters and numbers." }),
  currencies: z.array(z.string()).optional(),
});
