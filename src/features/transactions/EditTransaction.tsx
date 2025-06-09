import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./transactionSchemas";
import {
  buttonSolid,
  formDiv,
  input,
  labelClasses,
} from "../../app/globalClasses";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useLocalApi } from "../../app/hooks";
import { useParams } from "react-router";
import { editTransaction } from "./mutations/editTransaction";
import { transactionType } from "./transactionTypes";
import { type Currency, type CurrencyState } from "../currency/currencyTypes";

const EditTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<CurrencyState>("EUR");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "SAVINGS">("EXPENSE");
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  //   Grab ID from url
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;

  const {
    data: transactions,
    isLoading,
    isPending,
  } = useLocalApi("transactions", numericId);
  const { data: countryCurrencies } = useLocalApi("currencies");

  useEffect(() => {
    if (transactions) {
      setTitle(transactions?.title);
      setAmount(transactions?.amount);
      setCurrency(transactions?.currency);
      setType(transactions?.type);
      setNote(transactions?.note);
    }
  }, [transactions]);

  useEffect(() => {
    setCurrencies(countryCurrencies);
  }, [countryCurrencies]);

  const mutation = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      setTitle("");
      setAmount("");
      setCurrency("EUR");
      setNote("");
      setType("INCOME");
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  const currencyActiveClass = (value: CurrencyState) =>
    currency === value ? "bg-[#5152fb]" : "";

  const typeActiveClass = (value: "EXPENSE" | "INCOME" | "SAVINGS") =>
    type === value ? "bg-[#5152fb]" : "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = transactionSchema.safeParse({
      id: transactions?.id,
      userId: user?.id,
      date: new Date().toLocaleDateString(),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currency: formData.get("currency"),
      note: formData.get("note"),
      type: formData.get("type"),
    });

    if (!result.success) {
      console.log("Validation error:", result.error.flatten());
      return;
    }

    mutation.mutate({
      ...result.data,
      currency: result.data.currency as CurrencyState,
    });
  };

  if (isLoading || isPending) return <h1>We're loading your transaction...</h1>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
          {transactionType.map((type) => {
            return (
              <button
                key={Math.random()}
                className={`w-fit grow-0 rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2  flex-1 ${typeActiveClass(
                  type.name
                )}`}
                type="button"
                onClick={() => setType(type.name)}
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
          {currencies?.map((currency) => {
            const { code } = currency;

            return (
              <button
                key={Math.random()}
                className={`w-fit grow-0 rounded-lg cursor-pointer p-2 border-white flex-1 text-white border-dotted border-2  flex-1 ${currencyActiveClass(
                  code
                )}`}
                type="button"
                onClick={() => setCurrency(code)}
              >
                {code}
              </button>
            );
          })}
        </div>
        <input
          className={input}
          type="hidden"
          name="currency"
          value={currency}
        />
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

      <button type="submit" className={buttonSolid}>
        Update transaction
      </button>
    </form>
  );
};

export default EditTransaction;
