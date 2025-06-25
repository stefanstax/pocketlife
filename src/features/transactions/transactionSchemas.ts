import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string().nonempty({ message: "Please enter transaction title" }),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z
      .number({ message: "Please enter transaction amount" })
      .positive("Transaction amount must be higher than 0")
  ),
  userId: z.string(),
  currencyId: z
    .string()
    .nonempty({ message: "Transaction currency must be selected" }),
  note: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"], {
    message: "Please select transaction type",
  }),
  context: z.enum(["PERSONAL", "BUSINESS"], {
    message: "Please select transaction context",
  }),
  receipt: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().url(),
    })
    .nullable()
    .optional(),
});
