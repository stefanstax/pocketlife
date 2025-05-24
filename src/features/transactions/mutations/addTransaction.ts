import type { Transaction } from "../transactionTypes";

export const addTransaction = async (data: Transaction) => {
  const res = await fetch("http://localhost:3000/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add new transaction");
  }

  return res.json();
};
