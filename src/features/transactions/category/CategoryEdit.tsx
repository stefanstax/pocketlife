import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
const IconPicker = lazy(() => import("../../../components/IconPicker"));
import type { EditCategoryType } from "./types/categoryType";
import SubmitButton from "../../../components/SubmitButton";
import { editCategorySchemas } from "./schemas/categorySchemas";
import { toast } from "react-toastify";
import FormError from "../../../components/FormError";
import {
  useEditCategoryMutation,
  useGetCategoryByIdQuery,
} from "./api/transactionCategories";
import { useParams } from "react-router";
import BlurredSpinner from "../../../components/BlurredSpinner";
import DataSpinner from "../../../components/DataSpinner";

const CategoryEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<EditCategoryType>({
    id: id ?? "",
    name: "",
    icon: "",
  });

  const [formDataErrors, setFormDataErrors] = useState<
    Partial<Record<string, string>>
  >({});

  const [editCategory] = useEditCategoryMutation();
  const { data, isLoading } = useGetCategoryByIdQuery(id ?? "");

  useEffect(() => {
    setFormData({
      ...formData,
      name: data?.name ?? "",
      icon: data?.icon ?? "",
    });
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = editCategorySchemas.safeParse(formData);

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
      const toastId = toast.loading("Updating...");
      try {
        await editCategory(verifyData?.data).unwrap();
        toast.update(toastId, {
          render: `${formData?.name} has been updated`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } catch (error: any) {
        toast.update(toastId, {
          render: error?.data?.message ?? "Uncaught error.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    }
  };

  if (isLoading) return <BlurredSpinner />;

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
        <Suspense fallback={<DataSpinner />}>
          <IconPicker
            value={formData?.icon}
            setIcon={(value: string) =>
              setFormData((prev) => ({ ...prev, icon: value }))
            }
          />
        </Suspense>
      </div>
      <SubmitButton aria="Update" label={`Update ${formData?.name}`} />
    </form>
  );
};

export default CategoryEdit;
