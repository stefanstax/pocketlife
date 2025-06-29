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
import BlurredSpinner from "../../../components/BlurredSpinner";

const CurrencyEdit = () => {
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });
  const [serverError, setServerError] = useState<any>();

  const { id } = useParams();

  const [editCurrencyById, { isLoading, isSuccess }] =
    useEditCurrencyByIdMutation();
  const { data: currencies, isLoading: loadingCurrencies } =
    useGetCurrencyByIdQuery(id ?? "");

  useEffect(() => {
    if (currencies) {
      setFormData({
        code: currencies?.code,
        name: currencies?.name,
        symbol: currencies?.symbol,
      });
    }
  }, [currencies]);

  if (loadingCurrencies) return <BlurredSpinner />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const verifyData = currenciesSchema.safeParse({
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
      } catch (error: any) {
        setServerError(error?.data?.message ?? "Uncaught error.");
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
      <SubmitButton
        aria="Save Currency"
        label={isLoading ? "Saving..." : "Save currency"}
      />
      {serverError && (
        <p className="bg-black text-red-400 p-2 w-fit">{serverError}</p>
      )}
      {isSuccess && (
        <p className="bg-black rounded-sm text-white p-2 w-fit">
          Currency successfully saved.
        </p>
      )}
    </form>
  );
};

export default CurrencyEdit;
