import { z } from "zod";

export const transactionSchema = z.object({
  id: z.number(),
  title: z.string(),
  amount: z.preprocess((val) => parseFloat(String(val)), z.number().positive()),
  userId: z.number(),
  currencyId: z.number(),
  note: z.string(),
  date: z.string(),
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
});
