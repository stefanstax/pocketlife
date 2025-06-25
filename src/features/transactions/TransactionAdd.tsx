import { useState, type FormEvent } from "react";
import { transactionSchema } from "./transactionSchemas";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  type Receipt,
  type TransactionContexts,
  type TransactionExtra,
  type TransactionTypes,
} from "./transactionTypes";
import SubmitButton from "../../components/SubmitButton";
// Form Fields
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import { nanoid } from "@reduxjs/toolkit";
import { useLocalApi } from "../../app/hooks";
import type { CurrencyState } from "./currency/currencyTypes";
import { useAddTransactionMutation } from "./api/transactionsApi";
import UploadField from "../../components/forms/UploadFile";

const TransactionAdd = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const [addTransaction] = useAddTransactionMutation();

  const { user } = useSelector((state: RootState) => state.auth);
  const { data: currencies } = useLocalApi("currencies");

  const userCurrencies = currencies?.filter((currency: CurrencyState) =>
    user?.currencies?.includes(currency?.id ?? "")
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const verifiedData = transactionSchema.safeParse({
      id: nanoid(),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currencyId: formData.get("currencyId"),
      note: formData.get("note"),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      type: formData.get("type"),
      context: formData.get("context"),
      receipt: receipt,
      userId: user?.id,
    });

    if (!verifiedData.success) {
      const flattened = verifiedData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors).map(([key, val]) => [
          key,
          val?.[0],
        ])
      );
      setFormErrors(fieldErrors);
      return;
    }

    if (verifiedData.success) {
      try {
        await addTransaction(verifiedData?.data as TransactionExtra).unwrap();
        setTitle("");
        setAmount("");
        setCurrencyId("");
        setNote("");
        setType("");
        setContext("");
        setCurrencyId("");
        setReceipt(null);
        console.log("Transaction has been added!");
      } catch (error) {
        console.log("There has been a problem", error);
      }
    }
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
        currencies={userCurrencies}
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

export default TransactionAdd;
