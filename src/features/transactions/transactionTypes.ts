export interface Transaction {
  id: string;
  date: string;
  userId: string;
  amount: number;
  currencyId: number;
  title: string;
  note: string;
  type: TransactionTypes;
  context: TransactionContexts;
}

export type TransactionTypes = "INCOME" | "EXPENSE" | "SAVINGS";
export type TransactionContexts = "PERSONAL" | "BUSINESS";

export const transactionTypes = [
  { name: "EXPENSE" },
  { name: "INCOME" },
  { name: "SAVINGS" },
];

export const transactionContexts = [{ name: "BUSINESS" }, { name: "PERSONAL" }];

export interface Receipt {
  id: string;
  name: string;
  url: string;
}

export interface File {
  name: string;
}
