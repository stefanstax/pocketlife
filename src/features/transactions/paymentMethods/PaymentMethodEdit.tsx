import { useEffect, useState, type FormEvent } from "react";
import {
  paymentMethodOptions,
  type PaymentMethod,
  type PaymentMethodFormData,
} from "./paymentMethodsTypes";
import { paymentMethodsSchema } from "./paymentMethodsSchema";
import {
  useEditPaymentMethodMutation,
  useGetPaymentMethodByIdQuery,
} from "./api/paymentMethodsApi";
import { toast } from "react-toastify";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import SubmitButton from "../../../components/SubmitButton";

import { useParams } from "react-router";
import BlurredSpinner from "../../../components/BlurredSpinner";
import FormError from "../../../components/FormError";

const PaymentMethodEdit = () => {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: "",
    type: null,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const { id } = useParams();

  const { data, isLoading: paymentMethodLoading } =
    useGetPaymentMethodByIdQuery(id ?? "");

  const [editPaymentMethod] = useEditPaymentMethodMutation();

  useEffect(() => {
    setFormData({
      name: data?.name as PaymentMethod["name"],
      type: data?.type as PaymentMethod["type"],
    });
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const formData = new FormData(event.currentTarget);

    const verifyData = paymentMethodsSchema.safeParse({
      id: data?.id,
      name: formData.get("name"),
      type: formData.get("type"),
    });

    if (verifyData?.error) {
      const flatten = verifyData?.error?.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flatten.fieldErrors).map(([key, val]) => [key, val[0]])
      );

      setFormErrors(fieldErrors);
    }

    if (verifyData?.success) {
      await toast.promise(
        editPaymentMethod(verifyData?.data as PaymentMethod).unwrap(),
        {
          pending: "Payment method is being created.",
          success: "Payment method added.",
          error: "Payment method couldn't be created.",
        }
      );
    }
  };

  if (paymentMethodLoading) return <BlurredSpinner />;

  return (
    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-4">
      <div className={formDiv}>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          className={input}
          type="text"
          name="name"
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {formErrors?.name && <FormError fieldError={formErrors?.name} />}
      </div>
      <div className={formDiv}>
        <label htmlFor="type" className={labelClasses}>
          Type
        </label>
        <select
          name="type"
          value={formData?.type ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as PaymentMethod["type"],
            })
          }
          className={input}
        >
          {paymentMethodOptions.map((paymentMethod) => {
            return (
              <option key={paymentMethod?.name} value={paymentMethod?.type}>
                {paymentMethod?.name}
              </option>
            );
          })}
        </select>
        {formErrors?.type && <FormError fieldError={formErrors?.type} />}
      </div>
      <SubmitButton aria="Create transaction" label="Update" />
    </form>
  );
};

export default PaymentMethodEdit;
