import type { CurrencyState } from "./currency/currencyTypes";

export interface Transaction {
  id: string;
  date: string;
  updatedDate?: string;
  time: string;
  updatedTime?: string;
  userId: string;
  amount: number;
  currencyId: string;
  title: string;
  note: string;
  type: TransactionTypes;
  context: TransactionContexts;
  receipt?: Receipt;
}

export type TransactionClone = Omit<Transaction, "id" | "currency">;

export interface TransactionWithCurrency extends Transaction {
  currency: CurrencyState;
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
