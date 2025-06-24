export interface CurrencyState {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface FavoriteCurrenciesState {
  currencies: string[];
  userId: string;
}
