import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./transactionSchemas";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { useLocalApi } from "../../app/hooks";
import { redirect, useParams } from "react-router";
import { editTransaction } from "./mutations/editTransaction";
import { type CurrencyState } from "../currency/currencyTypes";
import {
  type TransactionContext,
  transactionTypes,
  type TransactionType,
  transactionContexts,
} from "./transactionTypes";
import SubmitButton from "../../components/SubmitButton";
import VariantLink from "../../components/VariantLink";

const EditTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currencyId, setCurrencyId] = useState<number | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionType | "">("");
  const [context, setContext] = useState<TransactionContext | "">("");
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );
  //   Grab ID from url
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;

  const {
    data: transactionData,
    isLoading,
    isPending,
  } = useLocalApi("transactions", numericId);

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

  const typeActiveClass = (value: TransactionType) =>
    type === value ? "bg-[#5152fb]" : "";

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
      console.log("Validation error:", result.error.flatten());
      return;
    }

    mutation.mutate(result.data);
  };

  if (isLoading || isPending) return <h1>We're loading your transaction...</h1>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {!transactionData?.availableCurrencies?.some(
        (currency: CurrencyState) =>
          currency.id === transactionData.transactionCurrency.id
      ) && (
        <>
          <p className="text-red-400">
            *Your transaction currency (
            {transactionData.transactionCurrency.code}) is not among your
            available currencies
          </p>
          <VariantLink
            aria="Go to Currency modification page"
            variant="PRIMARY"
            link="/select-currencies/"
            label="Modify available currencies"
          />
        </>
      )}
      <div className={formDiv}>
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          className={input}
          type="text"
          name="title"
          value={title}
          placeholder="What was this transaction"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={formDiv}>
        <label htmlFor="amount" className={labelClasses}>
          Amount
        </label>
        <input
          className={input}
          type="number"
          name="amount"
          step={0.1}
          placeholder="How much was this transaction"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {/* Type */}
      <div className="flex flex-col">
        <label className={labelClasses} htmlFor="type">
          Transaction Type
        </label>
        <div className="flex-wrap w-full flex gap-2 border-1 px-4 py-2 border-t-0 border-white rounded-b-lg">
          {transactionTypes.map((type) => {
            return (
              <button
                key={type.name}
                type="button"
                className={`w-fit text-xs grow-0 rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2  flex-1 ${typeActiveClass(
                  type.name as TransactionType
                )}`}
                onClick={() => setType(type.name as TransactionType)}
              >
                {type.name}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="type" value={type} />
      </div>
      {/* Currency */}
      <div className="flex flex-col">
        <label className={labelClasses} htmlFor="currency">
          Select Currency
        </label>

        <div className="flex-wrap w-full flex gap-2 border-1 px-4 py-2 border-t-0 border-white rounded-b-lg">
          {transactionData.availableCurrencies?.map(
            (currency: CurrencyState) => {
              const { id, code } = currency;

              return (
                <button
                  key={id}
                  type="button"
                  className={`${
                    currencyId === id ? "bg-[#5152fb]" : ""
                  } w-fit grow-0 text-xs rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2  flex-1`}
                  onClick={() => setCurrencyId(Number(id))}
                >
                  {code}
                </button>
              );
            }
          )}
        </div>
        {formErrors.currencyId && (
          <p className="my-2 text-red-400">{formErrors.currencyId}</p>
        )}
        <input
          className={input}
          type="hidden"
          name="currencyId"
          value={currencyId}
        />
      </div>
      {/* Business or Personal Toggle */}
      <div className={formDiv}>
        <label className={labelClasses} htmlFor="variant">
          Transaction Context
        </label>
        <div className={`${input} flex gap-2 text-xs`}>
          {transactionContexts.map((option) => {
            return (
              <button
                key={option.name}
                type="button"
                className={`border-2 border-dotted border-white px-4 rounded-lg py-2 ${
                  option.name === context ? "bg-[#5152fb]" : ""
                }`}
                onClick={() => setContext(option.name as TransactionContext)}
              >
                {option.name}
              </button>
            );
          })}
          <input type="hidden" value={context} name="context" />
        </div>
      </div>
      <div className={formDiv}>
        <label htmlFor="note" className={labelClasses}>
          Note
        </label>
        <input
          className={input}
          type="text"
          name="note"
          placeholder="Any note for transaction"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      <input type="hidden" value={type} name="type" />

      <SubmitButton aria="Update transaction" label="Update Transaction" />
    </form>
  );
};

export default EditTransaction;
