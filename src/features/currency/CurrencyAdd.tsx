import { useState, type ChangeEvent, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { currenciesSchema } from "./currenciesSchema";
import { useMutation } from "@tanstack/react-query";
import { addCurrency } from "./mutations/addCurrency";
import type { CurrencyState } from "./currencyTypes";
import SubmitButton from "../../components/SubmitButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { nanoid } from "@reduxjs/toolkit";

const CurrenciesAdd = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: addCurrency,
    onSuccess: () => {
      setFormData({
        code: "",
        name: "",
        symbol: "",
      });
    },
    onError: () => {
      console.error("There was a problem with mutating your data.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const verifyData = currenciesSchema.safeParse({
      id: nanoid(),
      code: formData.get("code"),
      name: formData.get("name"),
      symbol: formData.get("symbol"),
      userId: user?.id,
    });

    if (!verifyData.success) {
      console.error(
        "Form was not up to the required standards.",
        verifyData.error
      );
    }

    if (verifyData.success) {
      mutation.mutate(verifyData.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={formDiv}>
        <label htmlFor="code" className={labelClasses}>
          Currency Code
        </label>
        <input
          className={input}
          type="text"
          name="code"
          placeholder="Currency code"
          value={formData.code}
          onChange={handleChange}
        />
      </div>
      <div className={formDiv}>
        <label htmlFor="name" className={labelClasses}>
          Currency Name
        </label>
        <input
          className={input}
          type="text"
          name="name"
          placeholder="Currency name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className={formDiv}>
        <label htmlFor="symbol" className={labelClasses}>
          Currency Symbol
        </label>
        <input
          className={input}
          type="text"
          name="symbol"
          placeholder="Currency symbol"
          value={formData.symbol}
          onChange={handleChange}
        />
      </div>
      <SubmitButton aria="Create currency" label="Create currency" />
    </form>
  );
};

export default CurrenciesAdd;
