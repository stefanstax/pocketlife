export interface CurrencyState {
  id?: number;
  code: string;
  name: string;
  symbol: string;
}

export interface FavoriteCurrenciesState {
  currencies: number[];
  userId: number;
}
