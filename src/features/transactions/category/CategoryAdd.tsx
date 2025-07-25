import { useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import IconPicker from "../../../components/IconPicker";
import type { AddCategoryType } from "./types/categoryType";
import SubmitButton from "../../../components/SubmitButton";
import { categorySchemas } from "./schemas/categorySchemas";
import { toast } from "react-toastify";
import FormError from "../../../components/FormError";
import { useAddCategoryMutation } from "./api/transactionCategories";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

const CategoryAdd = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<AddCategoryType>({
    name: "",
    icon: "",
    user_id: user?.id ?? "",
  });
  const [formDataErrors, setFormDataErrors] = useState<
    Partial<Record<string, string>>
  >({});

  const [addCategory] = useAddCategoryMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = categorySchemas.safeParse(formData);

    if (verifyData?.error) {
      const flattenErrors = verifyData?.error?.flatten();

      const fieldErrors = Object.fromEntries(
        Object.entries(flattenErrors.fieldErrors).map(([key, val]) => [
          key,
          val[0],
        ])
      );
      setFormDataErrors(fieldErrors);

      toast.error("Please check your field errors.");
    }

    if (verifyData?.success) {
      try {
        const wrapData = addCategory(verifyData?.data).unwrap();
        toast.promise(wrapData, {
          pending: `Creating ${formData?.name}`,
          success: `${formData?.name} successfully created.`,
        });
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-4">
      <div className={formDiv}>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          className={input}
          type="text"
          placeholder="Category name"
          value={formData?.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
        />
        {formDataErrors?.name && (
          <FormError fieldError={formDataErrors?.name} />
        )}
      </div>
      <div className={formDiv}>
        <label htmlFor="icon" className={labelClasses}>
          Icon
        </label>
        <IconPicker
          value={formData?.icon}
          setIcon={(value: string) =>
            setFormData((prev) => ({ ...prev, icon: value }))
          }
        />
      </div>
      <SubmitButton aria="Create" label={`Create ${formData?.name}`} />
    </form>
  );
};

export default CategoryAdd;
