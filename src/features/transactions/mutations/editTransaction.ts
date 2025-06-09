import type { Transaction } from "../transactionTypes";

export const editTransaction = async (
  data: Transaction
): Promise<Transaction> => {
  console.log(data);

  const res = await fetch(`http://localhost:3000/transactions/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result;

  try {
    result = await res.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!res.ok) {
    throw new Error("Failed to update transaction");
  }

  return result;
};
