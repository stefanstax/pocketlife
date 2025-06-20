import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./transactionSchemas";
import { useLocalApi } from "../../app/hooks";
import { redirect, useParams } from "react-router";
import { editTransaction } from "./mutations/editTransaction";
import { type CurrencyState } from "../currency/currencyTypes";
import {
  type TransactionContexts,
  type TransactionTypes,
  type Receipt,
} from "./transactionTypes";
import SubmitButton from "../../components/SubmitButton";
import VariantLink from "../../components/VariantLink";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import UploadField from "../../components/UploadFile";
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";

const EditTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [currencyId, setCurrencyId] = useState<number | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );
  //   Grab ID from url
  const { id } = useParams();

  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: transactionData,
    isLoading,
    isPending,
  } = useLocalApi("transactions", id);

  const currenciesMatch = transactionData?.availableCurrencies?.some(
    (currency: CurrencyState) =>
      currency.id === transactionData.transactionCurrency.id
  );

  useEffect(() => {
    if (transactionData) {
      setTitle(transactionData?.title);
      setAmount(transactionData?.amount);
      if (currenciesMatch) {
        setCurrencyId(transactionData?.transactionCurrency.id);
      } else {
        setCurrencyId("");
      }
      setReceipt(transactionData?.receipt);
      setType(transactionData?.type);
      setNote(transactionData?.note);
      setContext(transactionData?.context);
    }
  }, [transactionData]);

  const mutation = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      redirect("/transactions/");
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = transactionSchema.safeParse({
      id: transactionData?.id,
      userId: transactionData.userId,
      date: new Date().toLocaleDateString(),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currencyId: formData.get("currencyId"),
      note: formData.get("note"),
      type: formData.get("type"),
      context: formData.get("context"),
      receipt: receipt,
    });

    if (!result.success) {
      const flattened = result.error.flatten();

      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors)?.map(([key, val]) => [
          key,
          val?.[0],
        ])
      );

      setFormErrors(fieldErrors);
      return;
    }

    if (result.success) {
      mutation.mutate(result.data);
    }
  };

  if (isLoading || isPending) return <h1>We're loading your transaction...</h1>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {!transactionData?.availableCurrencies?.some(
        (currency: CurrencyState) =>
          currency.id === transactionData.transactionCurrency.id
      ) && (
        <div className="flex items-center gap-2 bg-black p-4 ">
          <p className="text-red-400">
            *Your transaction currency (
            {transactionData?.transactionCurrency?.code}) is not among your
            available currencies
          </p>
          <VariantLink
            aria="Go to Currency modification page"
            variant="PRIMARY"
            link="/select-currencies/"
            label="Modify available currencies"
          />
        </div>
      )}
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        validationError={formErrors?.title}
      />
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        validationError={formErrors?.amount}
      />
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      <TransactionCurrency
        currencies={transactionData?.availableCurrencies}
        currencyId={currencyId}
        setCurrencyId={setCurrencyId}
        validationError={formErrors?.currencyId}
      />
      <TransactionContext
        context={context}
        setContext={setContext}
        validationError={formErrors?.context}
      />
      <TransactionNote
        note={note}
        setNote={setNote}
        validationError={formErrors?.note}
      />

      {context !== null && (
        <>
          <UploadField
            receipt={receipt}
            setReceipt={setReceipt}
            username={user?.username as string}
            hasFile={
              <a
                target="_blank"
                className={`border-2 border-dotted border-white px-4  py-2 text-xs ${
                  receipt?.url && "bg-[#5152fb]"
                }`}
                href={receipt?.url}
              >
                View Receipt: {receipt?.name}
              </a>
            }
          />

          {formErrors.receipt && (
            <p className="my-2 text-red-400">{formErrors.receipt}</p>
          )}
        </>
      )}

      <SubmitButton aria="Update transaction" label="Update Transaction" />
    </form>
  );
};

export default EditTransaction;
