import { Fragment, useEffect, useState, type FormEvent } from "react";
import {
  paymentMethodOptions,
  type PaymentMethod,
  type PaymentMethodFormData,
} from "./types/paymentMethodsTypes";
import { paymentMethodsSchema } from "./schemas/paymentMethodsSchema";
import {
  useEditPaymentMethodMutation,
  useGetPaymentMethodByIdQuery,
} from "./api/paymentMethodsApi";
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
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../app/authSlice";
import BlurredSpinner from "../../../components/BlurredSpinner";
import { useGetCurrenciesQuery } from "../currency/api/currenciesApi";

const PaymentMethodEdit = () => {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: "",
    type: null,
    budgets: [{ id: nanoid(), currencyId: "", amount: 0 }],
  });

  const { id } = useParams();
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: currencies } = useGetCurrenciesQuery();

  const { data, isLoading } = useGetPaymentMethodByIdQuery(id || "");
  const [editPaymentMethod] = useEditPaymentMethodMutation();

  useEffect(() => {
    setFormData({
      id,
      name: data?.name,
      type: data?.type,
      budgets: data?.budgets,
    } as PaymentMethodFormData);
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const verifyData = paymentMethodsSchema.safeParse(formData);

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
      await toast.promise(
        editPaymentMethod({
          ...verifyData?.data,
          id: id as string,
        }).unwrap(),
        {
          pending: "Payment method is being updated.",
          success: "Payment method updated.",
          error: "Payment method couldn't be updated.",
        }
      );
      // Store payment methods to user's slice
      dispatch(
        updateUser({
          ...user,
          paymentMethods: [
            ...(user?.paymentMethods as PaymentMethod[]),
            verifyData?.data as PaymentMethod,
          ],
        })
      );
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
          (b) => b.currencyId === newCurrency && b.id !== id
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
    setFormData((prev) => ({
      ...prev,
      budgets: Array.isArray(prev.budgets)
        ? [...prev.budgets, { id: nanoid(), currencyId: "", amount: 0 }]
        : [{ id: nanoid(), currencyId: "", amount: 0 }],
    }));
  };

  const removeBudget = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      budgets: Array.isArray(prev.budgets)
        ? prev.budgets.filter((i) => i?.id !== id)
        : [],
    }));
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
          placeholder="Revolut, Paypal, Cash, Bank, Wise, etc..."
          name="name"
          value={formData?.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {formErrors?.name && <FormError fieldError={formErrors?.name} />}
      </div>
      <div className={formDiv}>
        <label htmlFor="type" className={labelClasses}>
          Type
        </label>
        <div className={`${input} flex flex-wrap items-center gap-2`}>
          {paymentMethodOptions.map((paymentMethod) => {
            return (
              <Fragment key={paymentMethod?.type}>
                <button
                  type="button"
                  className={`${
                    formData?.type === paymentMethod?.type
                      ? "bg-gray-950 text-white border-black"
                      : ""
                  } min-w-[100px] font-[600] rounded-full text-sm cursor-pointer p-2 border-black border-solid border-1`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: paymentMethod?.type as PaymentMethod["type"],
                    })
                  }
                >
                  {paymentMethod?.name.toUpperCase()}
                </button>
                <input type="hidden" name="type" value={paymentMethod?.type} />
              </Fragment>
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
              currencies={currencies || []}
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

      <SubmitButton aria="Create transaction" label="Update Payment Method" />
    </form>
  );
};

export default PaymentMethodEdit;
