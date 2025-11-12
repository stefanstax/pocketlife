import { useEffect, useState, type FormEvent } from "react";
import { paymentMethodOptions, type Budget } from "./types/paymentMethodsTypes";
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
import TransactionAmount from "../fields/TransactionAmount";
import { nanoid } from "@reduxjs/toolkit";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import BlurredSpinner from "../../../components/BlurredSpinner";
import { useGetCurrenciesQuery } from "../currency/api/currenciesApi";
import { updateUserBudget } from "../../../app/authSlice";
const PaymentMethodEdit = () => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const { id } = useParams();
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const dispatch = useDispatch();
  const { data: currencies } = useGetCurrenciesQuery();

  const { data, isLoading } = useGetPaymentMethodByIdQuery(id || "");
  const [editPaymentMethod] = useEditPaymentMethodMutation();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setType(data.type);
      setBudgets(data.budgets ?? []);
    }
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = paymentMethodsSchema.safeParse({
      id,
      name,
      type,
      budgets,
    });

    if (!verifyData.success) {
      const flattenErrors = verifyData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattenErrors.fieldErrors).map(([key, val]) => [
          key,
          val[0],
        ])
      );
      setFormErrors(fieldErrors);
      return;
    }

    try {
      await editPaymentMethod(verifyData.data).unwrap();
      toast.success("Payment method updated.");
      verifyData?.data?.budgets.forEach((budget) => {
        dispatch(
          updateUserBudget({
            budgetId: budget?.id,
            currencyId: budget?.currencyId,
            amount: budget?.amount,
            type: "SET",
          })
        );
      });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update payment method.");
    }
  };

  const updateBudget = (
    id: string,
    field: "currencyId" | "amount",
    value: string | number
  ) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              [field]: field === "amount" ? Number(value) : String(value),
            }
          : b
      )
    );
  };

  const addBudget = () => {
    setBudgets((prev) => [
      ...prev,
      { id: nanoid(), currencyId: "", amount: 0 },
    ]);
  };

  const removeBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
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
          placeholder="Revolut, Paypal, etc..."
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormError fieldError={formErrors?.name} />
      </div>

      <div className={formDiv}>
        <label htmlFor="type" className={labelClasses}>
          Type
        </label>
        <div className={`${input} flex flex-wrap items-center gap-2`}>
          {paymentMethodOptions.map((option) => (
            <button
              key={option.type}
              type="button"
              className={`min-w-[100px] font-medium text-sm cursor-pointer p-2  ${
                type === option.type ? "bg-[#1A1A2E] text-white" : ""
              }`}
              onClick={() => setType(option.type)}
            >
              {option.name.toUpperCase()}
            </button>
          ))}
        </div>
        <FormError fieldError={formErrors?.type} />
      </div>

      {budgets.map((budget) => (
        <div key={budget.id} className="grid grid-cols-1 gap-4">
          <TransactionCurrency
            currencies={currencies ?? []}
            currencyId={budget.currencyId}
            setCurrencyId={(val) => updateBudget(budget.id, "currencyId", val)}
            validationError={formErrors?.currencyId}
          />
          <TransactionAmount
            labelType="Amount"
            amount={budget.amount}
            setAmount={(val) => updateBudget(budget.id, "amount", val)}
            validationError={formErrors?.amount}
          />
          <button
            type="button"
            className={`${TERTIARY} ${SHARED}`}
            onClick={() => removeBudget(budget.id)}
          >
            Remove Budget
          </button>
        </div>
      ))}

      <FormError fieldError={formErrors?.budgets} />

      <button
        type="button"
        className={`${PRIMARY} ${SHARED}`}
        onClick={addBudget}
      >
        Add Budget
      </button>

      <SubmitButton aria="Update payment method" label={`Update ${name}`} />
    </form>
  );
};

export default PaymentMethodEdit;
