export interface Transaction {
  id: number;
  date: string;
  userId: number;
  amount: number;
  currencyId: number;
  title: string;
  note: string;
  type: "INCOME" | "EXPENSE" | "SAVINGS";
}

export const transactionType: { name: "INCOME" | "EXPENSE" | "SAVINGS" }[] = [
  { name: "EXPENSE" },
  { name: "INCOME" },
  { name: "SAVINGS" },
];
