import type { CurrencyState } from "../currency/currencyTypes";

export interface RegistrationState {
  username: string;
  email: string;
  password: string;
  defaultCurrency: CurrencyState;
}
