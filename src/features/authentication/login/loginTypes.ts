import type { z } from "zod";
import { loginSchemas } from "./loginSchemas";

export type LoginState = z.infer<typeof loginSchemas>;
