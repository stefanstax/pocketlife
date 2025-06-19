import { z } from "zod";

export const transactionSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    amount: z.preprocess(
      (val) => parseFloat(String(val)),
      z.number().positive()
    ),
    userId: z.number(),
    currencyId: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Please select transaction currency")
    ),
    note: z.string(),
    date: z.string(),
    type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
    context: z.enum(["PERSONAL", "BUSINESS"]),
    receipt: z
      .object({
        id: z.string(),
        name: z.string(),
        url: z.string().url(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.context === "BUSINESS" && !data.receipt) {
      ctx.addIssue({
        path: ["receipt"],
        code: z.ZodIssueCode.custom,
        message: "Receipt is required for business transactions",
      });
    }
  });
