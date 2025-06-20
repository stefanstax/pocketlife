import { useEffect, useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { currenciesSchema } from "./currenciesSchema";
import { useMutation } from "@tanstack/react-query";
import type { CurrencyState } from "./currencyTypes";
import { useLocalApi } from "../../app/hooks";
import { useParams } from "react-router";
import { editCurrency } from "./mutations/editCurrency";
import SubmitButton from "../../components/SubmitButton";

const CurrencyEdit = () => {
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });

  const { id } = useParams();

  const {
    data: currencies,
    isLoading,
    isPending,
  } = useLocalApi("currencies", Number(id));

  useEffect(() => {
    if (currencies) {
      setFormData({
        code: currencies?.code,
        name: currencies?.name,
        symbol: currencies?.symbol,
      });
    }
  }, [currencies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: editCurrency,
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
      id,
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

  if (isLoading || isPending) return <h1>Loading Currency...</h1>;

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
          value={formData.code ?? ""}
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
          value={formData.name ?? ""}
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
          value={formData.symbol ?? ""}
          onChange={handleChange}
        />
      </div>
      <SubmitButton aria="Update Currency" label="Update Currency" />
    </form>
  );
};

export default CurrencyEdit;
