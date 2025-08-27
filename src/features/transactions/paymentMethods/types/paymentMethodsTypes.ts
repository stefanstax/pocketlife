import { z } from "zod";
import {
  budgetSchema,
  paymentMethodCreationSchema,
  paymentMethodsSchema,
} from "../schemas/paymentMethodsSchema";

export const paymentMethodOptions = [
  {
    name: "Cash",
    type: "cash",
  },
  {
    name: "Card",
    type: "card",
  },
  {
    name: "Bank",
    type: "bank",
  },
  {
    name: "Online",
    type: "online",
  },
  {
    name: "Crypto",
    type: "crypto",
  },
  {
    name: "Other",
    type: "other",
  },
];

export type PaymentMethod = z.infer<typeof paymentMethodsSchema>;
export type AddPaymentMethod = z.infer<typeof paymentMethodCreationSchema>;
export type Budget = z.infer<typeof budgetSchema>;
