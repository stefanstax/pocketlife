import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { addTransaction } from "./mutations/addTransaction";
import { transactionSchema } from "./transactionSchemas";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useLocalApi } from "../../app/hooks";
import {
  transactionContexts,
  transactionTypes,
  type TransactionContext,
  type TransactionType,
} from "./transactionTypes";
import type { CurrencyState } from "../currency/currencyTypes";
import SubmitButton from "../../components/SubmitButton";

const AddTransaction = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [context, setContext] = useState<TransactionContext | "">("");
  const [currencyId, setCurrencyId] = useState<number | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionType | "">("");
  const [currencies, setCurrencies] = useState<CurrencyState[]>([]);

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
      id: Math.floor(Math.random() * 100),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currencyId: Number(formData.get("currencyId")),
      note: formData.get("note"),
      date: new Date().toLocaleDateString(),
      type: formData.get("type"),
      context: formData.get("context"),
      userId: user?.id,
    });

    const tipio = formData.get("context");
    console.log(tipio);

    if (!result.success) {
      console.log("Validation error:", result.error.flatten());
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#1b1918] p-4 rounded-lg flex flex-col gap-4"
    >
      {/* Title */}
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
      {/* Amount */}
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
          {transactionTypes.map((option) => {
            return (
              <button
                key={option.name}
                className={`${
                  option.name === type ? "bg-[#5152fb]" : ""
                } w-fit grow-0 text-xs rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2  flex-1`}
                type="button"
                onClick={() => setType(option.name as TransactionType)}
              >
                {option.name}
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
          {currencies.map((curr) => {
            return (
              <button
                key={curr.code}
                type="button"
                className={`${
                  currencyId === curr.id ? "bg-[#5152fb]" : ""
                } w-fit text-xs grow-0 rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2 flex-1`}
                onClick={() => setCurrencyId(Number(curr.id))}
              >
                {curr.code}
              </button>
            );
          })}
        </div>
        <input
          className={input}
          type="hidden"
          name="currencyId"
          value={currencyId ?? ""}
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
      {/* Note */}
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
      <SubmitButton aria="Create transaction" label="Create Transaction" />
    </form>
  );
};

export default AddTransaction;
