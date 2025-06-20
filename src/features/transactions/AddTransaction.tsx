import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { addTransaction } from "./mutations/addTransaction";
import { transactionSchema } from "./transactionSchemas";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useLocalApi } from "../../app/hooks";
import {
  type Receipt,
  type TransactionContexts,
  type TransactionTypes,
} from "./transactionTypes";
import type { CurrencyState } from "../currency/currencyTypes";
import SubmitButton from "../../components/SubmitButton";
import UploadField from "../../components/UploadFile";
// Form Fields
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import { nanoid } from "@reduxjs/toolkit";

const AddTransaction = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [currencyId, setCurrencyId] = useState<number | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [currencies, setCurrencies] = useState<CurrencyState[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      setTitle("");
      setAmount("");
      setCurrencyId("");
      setNote("");
      setType("");
      setContext("");
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  const { data } = useLocalApi("currencies");

  useEffect(() => {
    if (data) {
      setCurrencies(data);
    }
  }, [data]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = transactionSchema.safeParse({
      id: nanoid(),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currencyId: Number(formData.get("currencyId")),
      note: formData.get("note"),
      date: new Date().toLocaleDateString(),
      type: formData.get("type"),
      context: formData.get("context"),
      receipt: receipt,
      userId: user?.id,
    });

    if (!result.success) {
      const flattened = result.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors).map(([key, val]) => [
          key,
          val?.[0],
        ])
      );

      setFormErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full  flex flex-col gap-4">
      {/* Title */}
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        validationError={formErrors?.title}
      />
      {/* Amount */}
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        validationError={formErrors?.amount}
      />
      {/* Type */}
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      {/* Currency */}
      <TransactionCurrency
        currencies={currencies}
        currencyId={currencyId}
        setCurrencyId={setCurrencyId}
        validationError={formErrors?.currencyId}
      />
      {/* Business or Personal Toggle */}
      <TransactionContext
        context={context}
        setContext={setContext}
        validationError={formErrors?.context}
      />
      {context === "BUSINESS" && (
        <>
          <UploadField
            receipt={receipt}
            setReceipt={setReceipt}
            username={user?.username as string}
          />
        </>
      )}
      {/* Note */}
      <TransactionNote note={note} setNote={setNote} />

      <SubmitButton aria="Create transaction" label="Create Transaction" />
    </form>
  );
};

export default AddTransaction;
