import { z } from "zod";

export const currenciesSchema = z.object({
  code: z.string().nonempty({ message: "Code is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  symbol: z.string().nonempty({ message: "Symbol is required" }),
  userId: z.string().nonempty(),
});
