import type { FavoriteCurrenciesState } from "../currencyTypes";

export const pickCurrency = async (
  data: FavoriteCurrenciesState
): Promise<FavoriteCurrenciesState> => {
  const response = await fetch(`http://localhost:3000/users/${data.userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    throw new Error("There was an issue on the server side");
  }

  return result;
};
