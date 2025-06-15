import type { CurrencyState } from "../currencyTypes";

export const editCurrency = async (
  data: CurrencyState
): Promise<CurrencyState> => {
  const res = await fetch(`http://localhost:3000/currencies/${data.id}`, {
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
