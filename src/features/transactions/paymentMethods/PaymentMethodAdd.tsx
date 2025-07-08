import { useState, type FormEvent } from "react";
import {
  paymentMethodOptions,
  type PaymentMethod,
  type PaymentMethodFormData,
} from "./paymentMethodsTypes";
import { paymentMethodsSchema } from "./paymentMethodsSchema";
import { useAddPaymentMethodMutation } from "./api/paymentMethodsApi";
import { toast } from "react-toastify";
import {
  formDiv,
  input,
  labelClasses,
  PRIMARY,
  SHARED,
  TERTIARY,
} from "../../../app/globalClasses";
import SubmitButton from "../../../components/SubmitButton";
import FormError from "../../../components/FormError";
import TransactionCurrency from "../fields/TransactionCurrency";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import TransactionAmount from "../fields/TransactionAmount";
import { nanoid } from "@reduxjs/toolkit";

const PaymentMethodAdd = () => {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: "",
    type: null,
    budgets: [{ id: nanoid(), currencyId: "", amount: 0 }],
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const { user } = useSelector((state: RootState) => state.auth);

  const [addPaymentMethod, { isLoading: creatingPaymentMethod }] =
    useAddPaymentMethodMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const verifyData = paymentMethodsSchema.safeParse(formData);

    if (verifyData?.error) {
      console.log(verifyData?.error);

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

  const updateBudget = (
    id: string,
    field: "currencyId" | "amount",
    value: string | number
  ) => {
    setFormData((prev) => {
      const currentIndex = prev.budgets.findIndex((b) => b.id === id);
      if (currentIndex === -1) return prev; // Budget not found, no update

      const newCurrency = field === "currencyId" ? String(value) : null;
      const newAmount = field === "amount" ? Number(value) : null;

      if (field === "currencyId") {
        const duplicateIndex = prev.budgets.findIndex(
          (b, i) => b.currencyId === newCurrency && b.id !== id
        );
        if (duplicateIndex !== -1) {
          toast.warning(`Currency ${newCurrency} is already added.`);
          return prev;
        }
      }

      const newBudgets = prev.budgets.map((budget) => {
        if (budget.id !== id) return budget;
        return {
          ...budget,
          currencyId: newCurrency ?? budget.currencyId,
          amount: newAmount ?? budget.amount,
        };
      });

      return {
        ...prev,
        budgets: newBudgets,
      };
    });
  };

  const addBudget = () => {
    setFormData({
      ...formData,
      budgets: [
        ...formData.budgets,
        { id: nanoid(), currencyId: "", amount: 0 },
      ],
    });
  };

  const removeBudget = (id: string) => {
    setFormData({
      ...formData,
      budgets: formData?.budgets.filter((i) => i?.id !== id),
    });
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
        <div className={`${input} flex items-center gap-2`}>
          {paymentMethodOptions.map((paymentMethod) => {
            return (
              <>
                <button
                  key={paymentMethod?.type}
                  type="button"
                  className={`${
                    formData?.type === paymentMethod?.type
                      ? "bg-[#5152fb] text-white border-black"
                      : ""
                  } min-w-[100px] rounded-lg cursor-pointer p-2 border-black border-solid border-1`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: paymentMethod?.type as PaymentMethod["type"],
                    })
                  }
                >
                  {paymentMethod?.name}
                </button>
                <input type="hidden" name="type" value={paymentMethod?.type} />
              </>
            );
          })}
        </div>

        {formErrors?.type && <FormError fieldError={formErrors?.type} />}
      </div>
      {formData?.budgets?.map((budget) => {
        return (
          <div
            key={budget?.id}
            className="grid grid-cols-1 justify-start items-start gap-4"
          >
            <TransactionCurrency
              currencies={user?.currencies || []}
              currencyId={budget?.currencyId}
              setCurrencyId={(value) =>
                updateBudget(budget?.id, "currencyId", value)
              }
              validationError={formErrors?.currencyId}
            />

            <TransactionAmount
              amount={budget?.amount}
              setAmount={(value) => updateBudget(budget?.id, "amount", value)}
              validationError={formErrors?.amount}
            />
            <button
              aria-label="Remove payment method budget"
              type="button"
              className={`${TERTIARY} ${SHARED}`}
              onClick={() => removeBudget(budget?.id)}
            >
              Remove Budget
            </button>
          </div>
        );
      })}
      {formErrors?.budgets && <FormError fieldError={formErrors?.budgets} />}
      <button
        type="button"
        aria-label="Add payment method budget"
        className={`${PRIMARY} ${SHARED}`}
        onClick={addBudget}
      >
        Add Budget
      </button>

      <SubmitButton
        aria="Create transaction"
        label={creatingPaymentMethod ? "Creating..." : "Create"}
      />
    </form>
  );
};

export default PaymentMethodAdd;
