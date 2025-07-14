import { z } from "zod";

export const loginSchemas = z.object({
  email: z.string().email().nonempty({ message: "Email can not be empty." }),
  passcode: z.string().min(1, { message: "Passcode is required." }),
});
