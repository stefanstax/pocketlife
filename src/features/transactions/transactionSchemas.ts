import { z } from "zod";

export const transactionSchema = z.object({
  id: z.number(),
  title: z.string(),
  amount: z.string().regex(/^[\d+-]+$/, {
    message: "Only digits, + and - are allowed",
  }),
  currency: z.enum(["EUR", "USD", "GBP"]),
  note: z.string(),
  date: z.string(),
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
});
