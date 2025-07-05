import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
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
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"], {
    message: "Please select transaction type",
  }),
  context: z.enum(["PERSONAL", "BUSINESS"], {
    message: "Please select transaction context",
  }),
  paymentMethodId: z
    .string()
    .nonempty({ message: "Please select a payment method." }),
  receipt: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().url(),
    })
    .nullable()
    .optional(),
});
