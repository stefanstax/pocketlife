export interface CurrencyState {
  code: string;
  name: string;
  symbol: string;
}

export interface FavoriteCurrenciesState {
  currencies: string[];
  userId: string;
}
