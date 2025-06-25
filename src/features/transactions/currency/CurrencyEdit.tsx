import { useEffect, useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { currenciesSchema } from "./currenciesSchema";
import type { CurrencyState } from "./currencyTypes";
import { useParams } from "react-router";
import SubmitButton from "../../../components/SubmitButton";
import {
  useEditCurrencyByIdMutation,
  useGetCurrencyByIdQuery,
} from "./api/currenciesApi";

const CurrencyEdit = () => {
  const [formData, setFormData] = useState<CurrencyState>({
    id: "",
    code: "",
    name: "",
    symbol: "",
  });

  const { id } = useParams();

  const [editCurrencyById] = useEditCurrencyByIdMutation();
  const { data: currencies } = useGetCurrencyByIdQuery(id ?? "");

  useEffect(() => {
    if (currencies) {
      setFormData({
        id: "",
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      try {
        await editCurrencyById(verifyData?.data).unwrap();
      } catch (error) {
        console.log(error);
      }
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
