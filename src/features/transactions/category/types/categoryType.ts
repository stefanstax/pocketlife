import type { z } from "zod";
import type {
  categorySchemas,
  editCategorySchemas,
} from "../schemas/categorySchemas";

export interface CategoryType extends AddCategoryType {
  id: string;
}

export type AddCategoryType = z.infer<typeof categorySchemas>;
export type EditCategoryType = z.infer<typeof editCategorySchemas>;
