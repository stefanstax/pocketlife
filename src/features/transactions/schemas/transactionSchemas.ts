import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  invoiceNumber: z
    .string()
    .nonempty({ message: "Please enter invoice number from the receipt" }),
  title: z.string().nonempty({ message: "Please enter transaction title" }),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z
      .number({ message: "Please enter transaction amount" })
      .positive("Transaction amount must be higher than 0")
  ),
  fee: z.number().min(0),
  categoryId: z.string().optional(),
  userId: z.string(),
  currencyId: z
    .string()
    .nonempty({ message: "Transaction currency must be selected" }),
  note: z.string(),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Please select transaction type",
  }),
  vat: z.enum(["0%", "20%", "No VAT"], {
    message: "Please select vat option",
  }),
  context: z.enum(["PERSONAL", "BUSINESS"], {
    message: "Please select transaction context",
  }),
  paymentMethodId: z
    .string()
    .nonempty({ message: "Please select a payment method." }),
  budgetId: z.string(),
  receipt: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().url(),
    })
    .nullable()
    .optional(),
});

export const newTransactionSchema = z.object({
  created_at: z
    .string()
    .min(5, { message: "Business transactions must include date and time." }),
  invoiceNumber: z
    .string()
    .nonempty({ message: "Please enter invoice number from the receipt" }),
  title: z.string().nonempty({ message: "Please enter transaction title." }),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z
      .number({ message: "Please enter transaction amount." })
      .positive("Transaction amount must be higher than 0")
  ),
  fee: z.number().min(0),
  categoryId: z.string().optional(),
  userId: z.string(),
  currencyId: z.string(),
  note: z.string(),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Please select transaction type",
  }),
  vat: z.enum(["0%", "20%", "No VAT"], {
    message: "Please select vat option",
  }),
  context: z.enum(["PERSONAL", "BUSINESS"], {
    message: "Please select transaction context",
  }),
  paymentMethodId: z
    .string()
    .nonempty({ message: "Please select a payment method." }),
  budgetId: z.string(),
  receipt: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().url(),
    })
    .nullable()
    .optional(),
});
