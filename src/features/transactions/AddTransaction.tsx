import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { addTransaction } from "./mutations/addTransaction";
import { transactionSchema } from "./transactionSchemas";

const AddTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<"EUR" | "USD" | "GBP">("EUR");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "SAVINGS">("INCOME");

  const mutation = useMutation({
    mutationFn: addTransaction,
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

  const getButtonClass = (value: "EUR" | "USD" | "GBP") =>
    `${baseButtonClasses} ${currency === value ? "bg-neutral-700" : ""}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = transactionSchema.safeParse({
      id: Math.floor(Math.random() * 100),
      title: formData.get("title"),
      amount: formData.get("amount"),
      currency: formData.get("currency"),
      note: formData.get("note"),
      date: new Date().toISOString(),
      type: formData.get("type"),
    });

    if (!result.success) {
      console.log("Validation error:", result.error.flatten());
      return;
    }

    mutation.mutate(result.data);
  };

  const handleAmount = (value: string) => {
    if (value.charAt(0) === "+" && value.charAt(1) === "+") {
      setType("SAVINGS");
    } else if (value.charAt(0) === "+" && value.charAt(1) !== "+") {
      setType("SAVINGS");
    } else if (value.charAt(0) === "-") {
      setType("EXPENSE");
    }

    setAmount(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <input
        className={inputClasses}
        type="text"
        name="title"
        value={title}
        placeholder="What was this transaction"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={inputClasses}
        type="text"
        name="amount"
        placeholder="How much was this transaction"
        value={amount}
        onChange={(e) => handleAmount(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          className={getButtonClass("EUR")}
          type="button"
          onClick={() => setCurrency("EUR")}
        >
          EUR
        </button>
        <button
          className={getButtonClass("USD")}
          type="button"
          onClick={() => setCurrency("USD")}
        >
          USD
        </button>
        <button
          className={getButtonClass("GBP")}
          type="button"
          onClick={() => setCurrency("GBP")}
        >
          GBP
        </button>
        <input
          className={inputClasses}
          type="hidden"
          name="currency"
          value={currency}
        />
      </div>
      <input
        className={inputClasses}
        type="text"
        name="note"
        placeholder="Any note for transaction"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <input type="hidden" value={type} name="type" />

      <button type="submit" className={baseButtonClasses}>
        Add transaction
      </button>
    </form>
  );
};

export default AddTransaction;
