import type { Currency } from "../currencyTypes";

export const currency = async (data: Currency) => {
  const res = await fetch("http://localhost:3000/currencies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let errorData = null;

  try {
    errorData = await res.json();
  } catch (err) {
    // fallback if res is not JSON
    const text = await res.text();
    errorData = { message: text || "Unknown error" };
  }

  if (!res.ok) {
    throw new Error(
      errorData.message || "Currency could not be added at this time."
    );
  }

  return res;
};
