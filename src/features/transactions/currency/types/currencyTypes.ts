import type { z } from "zod";
import type { currenciesSchema } from "../schemas/currenciesSchema";

export type CurrencyState = z.infer<typeof currenciesSchema>;
