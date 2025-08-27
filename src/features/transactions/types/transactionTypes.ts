import type { z } from "zod";
import type { CurrencyState } from "../currency/types/currencyTypes";
import type { PaymentMethod } from "../paymentMethods/types/paymentMethodsTypes";
import type {
  newTransactionSchema,
  transactionSchema,
} from "../schemas/transactionSchemas";

export type Transaction = z.infer<typeof transactionSchema>;
export type NewTransaction = z.infer<typeof newTransactionSchema>;

export interface EnrichedTransaction extends Transaction {
  currency: CurrencyState;
  paymentMethod: PaymentMethod;
}

export interface PaginatatedTransactions {
  data: EnrichedTransaction[];
  total: number;
  page: number;
  limit: number;
}

export type TransactionTypes = "INCOME" | "EXPENSE";
export type TransactionContexts = "PERSONAL" | "BUSINESS";

export const transactionTypes = [{ name: "EXPENSE" }, { name: "INCOME" }];
export const transactionContexts = [{ name: "BUSINESS" }, { name: "PERSONAL" }];
export interface Receipt {
  id: string;
  name: string;
  url: string;
}
export interface File {
  name: string;
}
