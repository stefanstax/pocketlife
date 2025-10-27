import { formDiv, input, labelClasses } from "../../../app/globalClasses";

import FormError from "../../../components/FormError";
import { IconShowcase } from "../../../components/IconPicker";
import type { CategoryType } from "../category/types/categoryType";

const TransactionCategory = ({
  data,
  categoryId,
  setCategoryId,
  validationError,
}: {
  data: CategoryType[];
  categoryId: string;
  setCategoryId: (value: string) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="icon" className={labelClasses}>
        Category
      </label>
      <div className={`w-full flex flex-wrap gap-2 ${input}`}>
        {(data ?? [])?.map((option) => {
          const { id, icon, name } = option;

          return (
            <button
              key={id}
              type="button"
              className={`${
                categoryId === id ? "bg-[#2A2BC9] text-white" : ""
              }  flex gap-2 items-center min-w-fit cursor-pointer px-4 py-2 text-sm`}
              onClick={() => setCategoryId(id)}
            >
              <IconShowcase pickedIcon={icon} />
              {name?.toUpperCase()}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="categoryId" value={categoryId ?? ""} />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionCategory;
