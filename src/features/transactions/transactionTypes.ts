import type { CurrencyState } from "./currency/currencyTypes";
import type { PaymentMethod } from "./paymentMethods/paymentMethodsTypes";

export interface Transaction {
  id: string;
  created_at: string;
  updated_at: string;
  userId: string;
  amount: number;
  currencyId: string;
  title: string;
  note: string;
  paymentMethodId: string;
  type: TransactionTypes;
  context: TransactionContexts;
  receipt?: Receipt;
}

export type TransactionClone = Omit<
  Transaction,
  "id" | "currency" | "paymentMethod"
>;

export interface EnrichedTransaction extends Transaction {
  currency: CurrencyState;
  paymentMethod: PaymentMethod;
}

export interface PaginatatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export type TransactionTypes = "INCOME" | "EXPENSE" | "SAVINGS";
export type TransactionContexts = "PERSONAL" | "BUSINESS";

export const transactionTypes = [
  { name: "EXPENSE" },
  { name: "INCOME" },
  { name: "SAVINGS" },
];

export interface TransactionCurrency extends Transaction {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export const transactionContexts = [{ name: "BUSINESS" }, { name: "PERSONAL" }];

export interface Receipt {
  id: string;
  name: string;
  url: string;
}

export interface File {
  name: string;
}
