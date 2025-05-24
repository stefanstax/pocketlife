export interface Transaction {
  id: number;
  date: string;
  amount: string;
  currency: "EUR" | "USD" | "GBP";
  title: string;
  note: string;
  type: "INCOME" | "EXPENSE" | "SAVINGS";
}
