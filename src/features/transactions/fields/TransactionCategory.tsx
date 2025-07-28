import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { IconShowcase } from "../../../components/IconPicker";
import FormError from "../../../components/FormError";
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
      <div className={`w-full flex gap-2 ${input} overflow-x-scroll`}>
        {(data ?? [])?.map((option) => {
          const { id, icon, name } = option;

          return (
            <button
              type="button"
              className={`${
                categoryId === id ? "bg-black text-white" : ""
              }  flex gap-2 items-center border-1 rounded-full overflow-x-hidden min-w-fit cursor-pointer px-4 py-2 font-[600] text-sm`}
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
