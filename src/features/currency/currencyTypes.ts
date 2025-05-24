export type CurrencyState =
  | "USD" // US Dollar
  | "EUR" // Euro
  | "GBP" // British Pound
  | "JPY" // Japanese Yen
  | "AUD" // Australian Dollar
  | "CAD" // Canadian Dollar
  | "CHF" // Swiss Franc
  | "CNY" // Chinese Yuan
  | "HKD" // Hong Kong Dollar
  | "SGD" // Singapore Dollar
  | "NZD" // New Zealand Dollar
  | "SEK" // Swedish Krona
  | "NOK" // Norwegian Krone
  | "DKK" // Danish Krone
  | "INR" // Indian Rupee
  | "BRL" // Brazilian Real
  | "ZAR" // South African Rand
  | "MXN" // Mexican Peso
  | "RUB" // Russian Ruble
  | "KRW" // South Korean Won
  // Balkan Currencies
  | "RSD" // Serbian Dinar
  | "HRK" // Croatian Kuna (pre-2023) [EUR now, included for legacy]
  | "BAM" // Bosnia and Herzegovina Convertible Mark
  | "MKD" // Macedonian Denar
  | "ALL" // Albanian Lek
  | "RON" // Romanian Leu
  | "BGN" // Bulgarian Lev
  | "TRY"; // Turkish Lira

export interface Currency {
  code: CurrencyState;
  name: string;
  symbol: string;
}
