import type { CurrencyState } from "../currency/currencyTypes";

export interface Transaction {
  id: string;
  date: string;
  userId: string;
  amount: number;
  currencyId: string;
  title: string;
  note: string;
  type: TransactionTypes;
  context: TransactionContexts;
  receipt?: Receipt;
}

export interface TransactionExtra extends Transaction {
  currency: TransactionCurrency;
  availableCurrencies: CurrencyState[];
}

export type TransactionTypes = "INCOME" | "EXPENSE" | "SAVINGS";
export type TransactionContexts = "PERSONAL" | "BUSINESS";

export const transactionTypes = [
  { name: "EXPENSE" },
  { name: "INCOME" },
  { name: "SAVINGS" },
];

export interface TransactionCurrency {
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
