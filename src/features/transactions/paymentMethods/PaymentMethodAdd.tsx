import { useState, type FormEvent } from "react";
import {
  paymentMethodOptions,
  type PaymentMethod,
  type PaymentMethodFormData,
} from "./paymentMethodsTypes";
import { paymentMethodsSchema } from "./paymentMethodsSchema";
import { useAddPaymentMethodMutation } from "./api/paymentMethodsApi";
import { toast } from "react-toastify";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import SubmitButton from "../../../components/SubmitButton";
import FormError from "../../../components/FormError";

const PaymentMethodAdd = () => {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: "",
    type: null,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const [addPaymentMethod, { isLoading: creatingPaymentMethod }] =
    useAddPaymentMethodMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const formData = new FormData(event.currentTarget);

    const verifyData = paymentMethodsSchema.safeParse({
      name: formData.get("name"),
      type: formData.get("type"),
    });

    if (verifyData?.error) {
      const flattenErrors = verifyData?.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattenErrors.fieldErrors).map(([key, val]) => [
          key,
          val[0],
        ])
      );

      setFormErrors(fieldErrors);
    }

    if (verifyData?.success) {
      await toast.promise(addPaymentMethod(verifyData?.data).unwrap(), {
        pending: "Payment method is being created.",
        success: "Payment method added.",
        error: "Payment method couldn't be created.",
      });
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
          placeholder="Revolut, Paypal, Cash, Bank, Wise, etc..."
          name="name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {formErrors?.name && <FormError fieldError={formErrors?.name} />}
      </div>
      <div className={formDiv}>
        <label htmlFor="type" className={labelClasses}>
          Type
        </label>
        <select name="type" className={input}>
          {paymentMethodOptions.map((paymentMethod) => {
            return (
              <option
                value={paymentMethod?.type}
                onChange={() =>
                  setFormData({
                    ...formData,
                    type: paymentMethod?.type as PaymentMethod["type"],
                  })
                }
              >
                {paymentMethod?.name}
              </option>
            );
          })}
        </select>
        {formErrors?.type && <FormError fieldError={formErrors?.type} />}
      </div>
      <SubmitButton
        aria="Create transaction"
        label={creatingPaymentMethod ? "Creating..." : "Create"}
      />
    </form>
  );
};

export default PaymentMethodAdd;
