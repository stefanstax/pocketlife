export type PaymentMethodTypes =
  | "cash"
  | "card"
  | "bank"
  | "online"
  | "crypto"
  | "other";

export const paymentMethodOptions = [
  {
    name: "Pick one",
    type: "",
  },
  {
    name: "Cash",
    type: "cash",
  },
  {
    name: "Card",
    type: "card",
  },
  {
    name: "Bank",
    type: "bank",
  },
  {
    name: "Online",
    type: "online",
  },
  {
    name: "Crypto",
    type: "crypto",
  },
  {
    name: "Other",
    type: "other",
  },
];

export interface PaymentMethod extends PaymentMethodFormData {
  id: string;
  userId: string;
}

export interface PaymentMethodFormData {
  name: string;
  type: PaymentMethodTypes | null;
}
