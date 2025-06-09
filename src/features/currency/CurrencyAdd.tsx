import { useState, type ChangeEvent, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import VariantLink from "../../components/VariantLink";
import { currenciesSchema } from "./currenciesSchema";
import { useMutation } from "@tanstack/react-query";
import { currency } from "./mutations/currency";
import type { CurrencyState } from "./currencyTypes";

const CurrenciesAdd = () => {
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const mutation = useMutation({
    mutationFn: currency,
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
      id: Math.floor(Math.random() * 10000),
      code: formData.get("code"),
      name: formData.get("name"),
      symbol: formData.get("symbol"),
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
          onChange={(event) => handleChange(event)}
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
          onChange={(event) => handleChange(event)}
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
          onChange={(event) => handleChange(event)}
        />
      </div>
      <VariantLink
        aria="Click to create currency"
        role="button"
        type="submit"
        variant="PRIMARY"
        label="Create currency"
      />
    </form>
  );
};

export default CurrenciesAdd;
