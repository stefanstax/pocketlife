import { useState, type ChangeEvent, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { currenciesSchema } from "./currenciesSchema";
import type { CurrencyState } from "./currencyTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useAddCurrencyMutation } from "./api/currenciesApi";
import SubmitButton from "../../../components/SubmitButton";
import { toast } from "react-toastify";

const CurrenciesAdd = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<CurrencyState>({
    code: "",
    name: "",
    symbol: "",
  });

  const [addCurrency, { isLoading }] = useAddCurrencyMutation();

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
        await toast.promise(addCurrency(verifyData?.data).unwrap(), {
          pending: "Currency is being created.",
          success: "Currency has been added.",
        });
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error. Check console.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
    </form>
  );
};

export default CurrenciesAdd;
