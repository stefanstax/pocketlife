import { z } from "zod";

export const categorySchemas = z.object({
  name: z.string().nonempty({ message: "Category name is required." }),
  icon: z.string(),
});

export const editCategorySchemas = z.object({
  id: z.string(),
  icon: z.string(),
  name: z.string(),
});
