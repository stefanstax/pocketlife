export interface Transaction {
  id: number;
  date: string;
  userId: number;
  amount: number;
  currencyId: number;
  title: string;
  note: string;
  type: TransactionType;
  context: TransactionContext;
}

export type TransactionType = "INCOME" | "EXPENSE" | "SAVINGS";
export type TransactionContext = "PERSONAL" | "BUSINESS";

export const transactionTypes = [
  { name: "EXPENSE" },
  { name: "INCOME" },
  { name: "SAVINGS" },
];

export const transactionContexts = [{ name: "BUSINESS" }, { name: "PERSONAL" }];
