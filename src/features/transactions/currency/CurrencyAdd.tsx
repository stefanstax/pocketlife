import { useState, type ChangeEvent, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { currenciesSchema } from "./currenciesSchema";
import type { CurrencyState } from "./currencyTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useAddCurrencyMutation } from "./api/currenciesApi";
import SubmitButton from "../../../components/SubmitButton";
import ServerError from "../../../components/ServerMessage";

const CurrenciesAdd = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });
  const [serverMessage, setServerMessage] = useState<any>();

  const [addCurrency, { isLoading, isError }] = useAddCurrencyMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const verifyData = currenciesSchema.safeParse({
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
      try {
        await addCurrency(verifyData?.data).unwrap();
        setServerMessage("Currency has been created successfully.");
      } catch (error) {
        console.log(error);
        setServerMessage(error?.data?.message ?? "Error was not caught.");
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
      <SubmitButton
        aria="Create currency"
        label={isLoading ? "Creating..." : "Create currency"}
      />

      {serverMessage && (
        <ServerError serverMessage={serverMessage} isError={isError} />
      )}
    </form>
  );
};

export default CurrenciesAdd;
