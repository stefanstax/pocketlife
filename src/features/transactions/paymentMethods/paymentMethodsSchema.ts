import { z } from "zod";

export const paymentMethodsSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(4, { message: "Payment method must have a minimum of 4 characters." }),
  type: z.enum(["cash", "card", "bank", "online", "crypto", "other"], {
    message: "Please select payment method type.",
  }),
});
